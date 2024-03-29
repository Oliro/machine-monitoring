import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';

import { EquipmentsService } from '../../services/api/equipments.service';
import { EquipmentsState } from '../../services/states/equipments.state';
import {
  EnumEquipmentState,
  EnumEquipmentStateColor,
} from '../../models/equipment-state.enum';
import { EquipmentState } from '../../models/equipment-state';
import { chartEquipmentData } from '../../models/chart-equipment-data';
import { EquipmentData } from '../../models/equipment-data';
import { EquipmentPositionHistory } from '../../models/equipment-position-history';

@Injectable({
  providedIn: 'root',
})
export class FacadeService {
  constructor(private api: EquipmentsService, private state: EquipmentsState) { }

  equipments$ = this.state.equipments$;

  public stateData: EquipmentState[] = [];

  load() {
    forkJoin([
      this.api.getEquipments(),
      this.api.getEquipmentsModels(),
      this.api.getEquipmentsPositionHistory(),
      this.api.getEquipmentsStatesHistory(),
      this.api.getEquipmentsStates(),
    ])
      .pipe(
        map(
          ([equipments, models, positionHistory, stateHistory, stateData]) => {
            this.stateData = stateData;

            const equipmentsWithForeignKeys: any[] = equipments.map(
              (equipment) => {
                const equipmentsModels = models.find(
                  (m) => m.id === equipment.equipmentModelId
                );
                const equipmentsPositionHistory = positionHistory.find(
                  (p) => p.equipmentId === equipment.id
                );
                const equipmentsStatesHistory = stateHistory.find(
                  (s) => s.equipmentId === equipment.id
                );

                return {
                  ...equipment,
                  equipmentsModels,
                  equipmentsPositionHistory: equipmentsPositionHistory,
                  equipmentsStatesHistory: equipmentsStatesHistory,
                  stateData: stateData,
                };
              }
            );

            return equipmentsWithForeignKeys;
          }
        )
      )
      .subscribe((equipmentsWithForeignKeys) => {
        return this.state.equipments(equipmentsWithForeignKeys);
      });
  }

  getLatestState(states: EquipmentData) {

    const statesArray = [...states.equipmentsStatesHistory.states]

    if (statesArray.length === 0) {
      return null;
    }

    const sortedStates = statesArray.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const state = this.styleState(sortedStates[0].equipmentStateId);
    const latestState = sortedStates[0].date;


    return { lastDate: latestState, state: state };
  }

  styleState(state: any) {
    switch (state) {
      case EnumEquipmentState.Operando:
        return { color: EnumEquipmentStateColor.Operando, name: 'Operando' };
      case EnumEquipmentState.Parado:
        return { color: EnumEquipmentStateColor.Parado, name: 'Parado' };
      case EnumEquipmentState.Manutencao:
        return {
          color: EnumEquipmentStateColor.Manutencao, name: 'Manutenção',
        };
      default:
        return { color: '#ffffff', name: 'Desconhecido' };
    }
  }

  getPerformanceColorType(value: number): string {
    value = (value / 24) * 100; //percent for 24 hours
    if (value > 60) {
      return '#41C90A';
    } else if (value > 30) {
      return '#8EE000';
    } else return '#C5C90A';
  }

  createPieChartEquipmentData(equipment: EquipmentData) {
    const pieChartEquipmentData: chartEquipmentData[] = [
      {
        title: equipment.name,
        model: equipment.equipmentsModels.name,
        productivity: { title: this.stateData[0].name, value: equipment.equipmentSumtHours.operando, color: this.stateData[0].color },
        earnings: equipment.gainEquipment,
      },
      {
        title: equipment.name,
        model: equipment.equipmentsModels.name,
        productivity: { title: this.stateData[1].name, value: equipment.equipmentSumtHours.parado, color: this.stateData[1].color },
        earnings: equipment.gainEquipment,
      },
      {
        title: equipment.name,
        model: equipment.equipmentsModels.name,
        productivity: { title: this.stateData[2].name, value: equipment.equipmentSumtHours.manutencao, color: this.stateData[2].color },
        earnings: equipment.gainEquipment,
      },
    ];

    this.state.pieChartEquipmentData(pieChartEquipmentData);
  }

  createPositonMapEquipmentData(equipmentsPositionHistory: EquipmentPositionHistory) {
    this.state.positonMapEquipmentData(equipmentsPositionHistory);
  }

}

