import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { MachineMonitor } from '../../models/machine-monitor';
import { chartEquipmentData } from '../../models/chart-equipment-data';
import { EquipmentPositionHistory } from '../../models/equipment-position-history';


@Injectable({
  providedIn: 'root'
})
export class EquipmentsState {

  private _equipments = new BehaviorSubject<MachineMonitor[]>([]);
  private _chartEquipmentData = new BehaviorSubject<chartEquipmentData[]>([]);
  private _equipmentPosition = new Subject<EquipmentPositionHistory>();

  equipments$ = this._equipments.asObservable();
  chartEquipmentData$ = this._chartEquipmentData.asObservable();
  equipmentPosition$ = this._equipmentPosition.asObservable();

  equipments(equipments: MachineMonitor[]) {
    this._equipments.next(equipments)
  }

  pieChartEquipmentData(chartEquipmentData: chartEquipmentData[]) {
    this._chartEquipmentData.next(chartEquipmentData);
  }

  positonMapEquipmentData(equipmentPosition: EquipmentPositionHistory) {
    this._equipmentPosition.next(equipmentPosition)
  }

  constructor() { }

}
