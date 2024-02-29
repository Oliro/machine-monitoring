import { Pipe, PipeTransform } from '@angular/core';
import { MachineMonitor } from '../../../models/machine-monitor';
import { EquipmentData } from '../../../models/equipment-data';
import { CalculateProductivityService } from './calculate-productivity.service';

@Pipe({
  name: 'equipmentData',
  standalone: true,

})
export class EquipmentDataPipe implements PipeTransform {
  
  constructor(private calculateProductivity: CalculateProductivityService){}

  transform(equipments: MachineMonitor[] | null | undefined, filter: any): EquipmentData[] {

    if (!equipments) {
      return [];
    }

    return this.calculateProductivity.calculateProductivity(equipments, filter);

  }



}
