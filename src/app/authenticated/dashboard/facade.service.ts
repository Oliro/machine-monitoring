import { Injectable } from '@angular/core';
import { EquipmentsService } from '../../services/api/equipments.service';
import { EquipmentsState } from '../../services/states/equipments.state';
import { forkJoin, map } from 'rxjs';
import { EnumEquipmentState, EnumEquipmentStateColor } from '../../models/equipment-state.enum';
import { EquipmentState } from '../../models/equipment-state';
import { PieChartEquipmentData } from '../../models/pie-chart-equipment-data';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  constructor(private api: EquipmentsService, private state: EquipmentsState) { }

  private latestStates: Map<number, any> = new Map<number, any>();
  
  equipments$ = this.state.equipments$;

  public stateData: EquipmentState[] = [];

  load() {

    forkJoin([
      this.api.getEquipments(),
      this.api.getEquipmentsModels(),
      this.api.getEquipmentsPositionHistory(),
      this.api.getEquipmentsStatesHistory(),
      this.api.getEquipmentsStates()
    ]).pipe(
      map(([equipments, models, positionHistory, stateHistory, stateData]) => {
        
        this.stateData = stateData;
        
        const equipmentsWithForeignKeys: any[] = equipments.map(equipment => {

          const equipmentsModels = models.find(m => m.id === equipment.equipmentModelId);
          const equipmentsPositionHistory = positionHistory.find(p => p.equipmentId === equipment.id);
          const equipmentsStatesHistory = stateHistory.find(s => s.equipmentId === equipment.id);

          return {
            ...equipment,
            equipmentsModels,
            equipmentsPositionHistory: equipmentsPositionHistory,
            equipmentsStatesHistory: equipmentsStatesHistory,
            stateData: stateData
          };
        });

        return equipmentsWithForeignKeys;
      })
    ).subscribe(equipmentsWithForeignKeys => {

      return  this.state.equipments(equipmentsWithForeignKeys);

    });

  }

  getLatestState(states: any) {
    const equipmentId = states.id;
    // Verificar se o estado mais recente está em cache
    if (this.latestStates.has(equipmentId)) {
      return this.latestStates.get(equipmentId);
    }
    // Se não estiver em cache, calcular o estado mais recente
    const latestState = states.equipmentsStatesHistory.states.reduce((prev: any, current: any) => {
      return (new Date(current.date).getTime() > new Date(prev.date).getTime()) ? current : prev;
    });
    // Estilizar o estado
    const state = this.styleState(latestState.equipmentStateId);
    // Armazenar o estado mais recente em cache
    this.latestStates.set(equipmentId, { lastDate: latestState.date, state: state });
    return { lastDate: latestState.date, state: state };
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

  getPerformanceColorType(value: number): string {
    value = value/24*100; //percent for 24 hours
    if (value > 60) {
      return '#2ecc71';
    } else if (value > 30) {
      return '#f1c40f';
    } else 
    return '#e74c3c';
  }

  createPieChartEquipmentData(equipmentSumtHours: any){

    const pieChartEquipmentData: PieChartEquipmentData[] = [
      {title: this.stateData[0].name, value: equipmentSumtHours.operando, color: this.stateData[0].color},
      {title: this.stateData[1].name, value: equipmentSumtHours.parado, color: this.stateData[1].color},
      {title: this.stateData[2].name, value: equipmentSumtHours.manutencao, color: this.stateData[2].color}
    ]

    this.state.pieChartEquipmentData(pieChartEquipmentData);

  }
  

}
