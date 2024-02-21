import { Injectable } from '@angular/core';
import { EquipmentsService } from '../../services/api/equipments.service';
import { EquipmentsState } from '../../services/states/equipments.state';
import { forkJoin, map, tap } from 'rxjs';
import { EnumEquipmentState, EnumEquipmentStateColor } from '../../models/equipment-state.enum';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  constructor(private api: EquipmentsService, private state: EquipmentsState) { }

  equipments$ = this.state.equipments$;

  load() {

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

    if (!states || states.length === 0) {
      return { date: 'N/A' };
    }

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

}
