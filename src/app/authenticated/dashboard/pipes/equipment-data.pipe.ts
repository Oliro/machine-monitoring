import { Pipe, PipeTransform } from '@angular/core';

import { MachineMonitor } from '../../../models/machine-monitor';
import { CalculateProductivityService } from './calculate-productivity.service';

@Pipe({
  name: 'equipmentData',
  standalone: true,
})
export class EquipmentDataPipe implements PipeTransform {

  constructor(private calculateProductivity: CalculateProductivityService) { }

  transform(equipments: MachineMonitor[] | null | undefined, filter: any): any[] {

    if (!equipments) {
      return [];
    }

    const calculateProductivityResult = this.calculateProductivity.calculateProductivity(equipments, filter);

    return calculateProductivityResult;
  }


}
