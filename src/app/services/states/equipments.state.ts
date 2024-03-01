import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MachineMonitor } from '../../models/machine-monitor';
import { chartEquipmentData } from '../../models/chart-equipment-data';


@Injectable({
  providedIn: 'root'
})
export class EquipmentsState {

  private _equipments = new BehaviorSubject<MachineMonitor[]>([]);
  private _chartEquipmentData = new BehaviorSubject<chartEquipmentData[]>([]);

  equipments$ = this._equipments.asObservable();
  chartEquipmentData$ = this._chartEquipmentData.asObservable();

  equipments(equipments: MachineMonitor[]) {
    this._equipments.next(equipments)
  }

  pieChartEquipmentData(chartEquipmentData: chartEquipmentData[]) {
    this._chartEquipmentData.next(chartEquipmentData);
  }

  constructor() { }

}
