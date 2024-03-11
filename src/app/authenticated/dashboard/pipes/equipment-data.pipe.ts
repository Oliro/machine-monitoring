import { Pipe, PipeTransform } from '@angular/core';

import { MachineMonitor } from '../../../models/machine-monitor';
import { CalculateProductivityService } from './calculate-productivity.service';
import { EquipmentData } from '../../../models/equipment-data';
import { FacadeService } from '../facade.service';

@Pipe({
  name: 'equipmentData',
  standalone: true,
})
export class EquipmentDataPipe implements PipeTransform {

  constructor(private calculateProductivity: CalculateProductivityService, public facade: FacadeService) { }

  transform(equipments: MachineMonitor[] | null | undefined, filter: any): any[] {

    if (!equipments) {
      return [];
    }

    const calculateProductivityResult = this.calculateProductivity.calculateProductivity(equipments, filter);

    const filterByPositionDate = this.filterEquipmentPositionDate(calculateProductivityResult, filter)

    return filterByPositionDate;
  }

  private filterEquipmentPositionDate(equipments: EquipmentData[], filter: any) {

    let startDate = new Date('Wed Feb 22 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)');
    let endDate = new Date('Wed Feb 27 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)');

    const startDateUTC = startDate.getTime();
    const endDateUTC = endDate.getTime();


    const filteredEquipments: EquipmentData[] = equipments.map((item) => {

      const filteredPositions = item.equipmentsPositionHistory.positions.filter((position) => {

        let currentStateDateUTC = new Date(position.date).getTime();
        
        return currentStateDateUTC >= startDateUTC && currentStateDateUTC <= endDateUTC;

      });

      item.equipmentsPositionHistory.positions = filteredPositions;

      this.facade.createPositonMapEquipmentData(item.equipmentsPositionHistory)

      return item; 
      
    });


    return filteredEquipments;

  }

}
