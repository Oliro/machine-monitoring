import { Injectable, OnInit } from '@angular/core';
import { EquipmentsService } from '../../services/api/equipments.service';
import { EquipmentsState } from '../../services/states/equipments.state';
import { forkJoin, map, tap } from 'rxjs';
import { EnumEquipmentState, EnumEquipmentStateColor } from '../../models/equipment-state.enum';
import { EquipmentStateHistory } from '../../models/equipment-state-history';
import { EquipmentState } from '../../models/equipment-state';
import { EquipmentModel, HourlyEarning } from '../../models/equipment-model';
import { MachineMonitor } from '../../models/machine-monitor';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  constructor(private api: EquipmentsService, private state: EquipmentsState) { }

  equipments$ = this.state.equipments$;

  public stateData: EquipmentState[] = [];

  load() {

    this.api.getEquipmentsStates().subscribe(result => this.stateData = result);

    forkJoin([
      this.api.getEquipments(),
      this.api.getEquipmentsModels(),
      this.api.getEquipmentsPositionHistory(),
      this.api.getEquipmentsStatesHistory()
    ]).pipe(
      map(([equipments, models, positionHistory, stateHistory]) => {

        const equipmentsWithForeignKeys: any[] = equipments.map(equipment => {

          const equipmentsModels = models.find(m => m.id === equipment.equipmentModelId);
          const equipmentsPositionHistory = positionHistory.find(p => p.equipmentId === equipment.id);
          const equipmentsStatesHistory = stateHistory.find(s => s.equipmentId === equipment.id);

          return {
            ...equipment,
            equipmentsModels,
            equipmentsPositionHistory: equipmentsPositionHistory,
            equipmentsStatesHistory: equipmentsStatesHistory
          };
        });

        return equipmentsWithForeignKeys;
      })
    ).subscribe(equipmentsWithForeignKeys => {

      //console.log(equipmentsWithForeignKeys);

      return this.api.getEquipments().subscribe(response => this.state.equipments(equipmentsWithForeignKeys));

    });

  }

  getLatestState(states: any) {
    const latestState = states.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const lastDate = latestState.date;
    const state = this.styleState(latestState.equipmentStateId);
    return { lastDate, state }
  }

  styleState(state: any) {
    switch (state) {
      case EnumEquipmentState.Operando:
        return { color: EnumEquipmentStateColor.Operando, name: 'Operando' };
      case EnumEquipmentState.Parado:
        return { color: EnumEquipmentStateColor.Parado, name: 'Parado' };
      case EnumEquipmentState.Manutencao:
        return { color: EnumEquipmentStateColor.Manutencao, name: 'Manutenção' };
      default:
        return { color: '#ffffff', name: 'Desconhecido' };
    }
  }

  calculateProductivity(equipment: MachineMonitor, equipmentState: EquipmentStateHistory) {

    const selectedDate = "2021-02-27";

    let previousDate: any = null;
    let getlastStatePreviousDay = 0;

    let equipmentSumtHours = { operando: 0, manutencao: 0, parado: 0 };

    equipmentState.states.forEach((state) => {

      const isDateSelected = state.date.startsWith(selectedDate);
      const isDatePreviousDay = state.date.startsWith(this.getPreviousDay(selectedDate));

      if (!(isDateSelected || isDatePreviousDay)) return;

      const stateName = this.stateData.find(data => data.id === state.equipmentStateId)?.name;

      //horas estado anterior para encontrar a diferença
      let startState = new Date(state.date).getTime();
      //horas estado atual para encontrar a diferença
      let endState = new Date(previousDate).getTime();

      if (!state.date.startsWith(selectedDate) && getlastStatePreviousDay === 0) {
        // Definir o início do dia anterior para encontrar a diferença caso a data não seja atual
        let newStartState = new Date(endState);
        newStartState.setUTCHours(0, 0, 0, 0);

        // Atualizar o estado inicial
        startState = newStartState.getTime();

        // Atualizar o sinalizador para indicar que o estado do último dia foi obtido
        getlastStatePreviousDay = 1;
      }

      if (endState == 0) {
        // Definir o final do dia como estado posterior, caso a data não seja atual
        let newEndState = new Date(startState);
        newEndState.setUTCHours(23, 59, 59, 999);

        // Obter o valor de data final em milissegundos
        endState = newEndState.getTime();
      }

      // Calcular a diferença em milissegundos
      const diffMs = Math.abs(endState - startState);
      // Converter a diferença de milissegundos para horas
      const diffHoras = diffMs / (1000 * 60 * 60);

      if (state.date.startsWith(selectedDate) || getlastStatePreviousDay === 1) {

        switch (stateName) {
          case this.stateData[0].name:
            equipmentSumtHours.operando += Math.ceil(diffHoras)
            break;
          case this.stateData[1].name:
            equipmentSumtHours.parado += Math.ceil(diffHoras)
            break;
          case this.stateData[2].name:
            equipmentSumtHours.manutencao += Math.ceil(diffHoras)
            break;
        }

        if (getlastStatePreviousDay === 1) {
          getlastStatePreviousDay = 2;
        }

      }
      previousDate = state.date
    })

    const gainEquipement = this.calculateGainEquipment(equipment, equipmentSumtHours);

    return { equipmentSumtHours, gainEquipement };
  }

  calculateGainEquipment(equipment: MachineMonitor, equipmentSumtHours: any) {

    const equipmentModelEarnings = { operando: 0, parado: 0, manutencao: 0 }

    equipment.equipmentsModels.hourlyEarnings.forEach((item) => {
      const equipmentEarning = this.stateData.find(state => state.id == item.equipmentStateId);
      switch (equipmentEarning?.name) {
        case 'Operando':
          equipmentModelEarnings.operando = item.value
          break;
        case 'Parado':
          equipmentModelEarnings.parado = item.value
          break;
        case 'Manutenção':
          equipmentModelEarnings.manutencao = item.value
          break;
        default:
          break;
      }
    });

    const _gainEquipement =
      (equipmentSumtHours.operando * equipmentModelEarnings.operando) +
      (equipmentSumtHours.manutencao * equipmentModelEarnings.manutencao) +
      (equipmentSumtHours.parado * equipmentModelEarnings.parado);

    return _gainEquipement;

  }

  getPreviousDay(data: string) {
    const currentDate = new Date(data);
    const oneDay = 24 * 60 * 60 * 1000; // em milissegundos
    const prevDate = new Date(currentDate.getTime() - oneDay);
    return prevDate.toISOString().split('T')[0];
  }

  getPerformanceColorType(value: number): string {
    value = value/24*100; //percent for 24 hours
    if (value > 60) {
      return '#2ecc71';
    } else if (value > 30) {
      return '#f1c40f';
    } else 
    return '#e74c3c';
  }
}


