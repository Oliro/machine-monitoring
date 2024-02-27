import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Equipment } from '../../models/equipment';
import { MachineMonitor } from '../../models/machine-monitor';
import { PieChartEquipmentData } from '../../models/pie-chart-equipment-data';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsState {

  private _equipments = new BehaviorSubject<MachineMonitor[]>([]);
  private _pieChartEquipmentData = new BehaviorSubject<PieChartEquipmentData[]>([]);

  equipments$ = this._equipments.asObservable();
  pieChartEquipmentData$ = this._pieChartEquipmentData.asObservable();

  equipments(equipments: MachineMonitor[]) {
    const immutableEquipments = equipments.map(equipment => ({ ...equipment }));
    this._equipments.next(immutableEquipments)
  }

  pieChartEquipmentData(pieChartEquipmentData: PieChartEquipmentData[]) {
    const immutablePieChartData = pieChartEquipmentData.map(data => ({ ...data }));
    this._pieChartEquipmentData.next(immutablePieChartData);
  }

  constructor() { }

}
