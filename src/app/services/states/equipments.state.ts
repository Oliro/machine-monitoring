import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Equipment } from '../../models/equipment';
import { MachineMonitor } from '../../models/machine-monitor';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsState {

  private _equipments = new BehaviorSubject<MachineMonitor[]>([]);

  equipments$ = this._equipments.asObservable();

  equipments(equipments: MachineMonitor[]) {
    this._equipments.next(equipments)
  }

  constructor() { }

}
