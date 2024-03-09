import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap} from 'rxjs';
import { Equipment } from '../../models/equipment';
import { EquipmentModel } from '../../models/equipment-model';
import { EquipmentPositionHistory } from '../../models/equipment-position-history';
import { EquipmentStateHistory } from '../../models/equipment-state-history';
import { EquipmentState } from '../../models/equipment-state';
import { MachineMonitor } from '../../models/machine-monitor';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService extends BaseService {

  constructor(private http: HttpClient) { super(); }

  getEquipments(): Observable<Equipment[]> {
    return this.http.get<MachineMonitor>(this.urlServiceV1).pipe(map((result) => result.equipments), tap(console.log));
  }

  getEquipmentsModels(): Observable<EquipmentModel[]> {
    return this.http.get<MachineMonitor>(this.urlServiceV1).pipe(map((result) => result.equipmentsModels), tap(console.log));
  }

  getEquipmentsPositionHistory(): Observable<EquipmentPositionHistory[]> {
    return this.http.get<MachineMonitor>(this.urlServiceV1).pipe(map((result) => result.equipmentsPositionHistory), tap(console.log));
  }

  getEquipmentsStatesHistory(): Observable<EquipmentStateHistory[]> {
    return this.http.get<MachineMonitor>(this.urlServiceV1).pipe(map((result) => result.equipmentsStatesHistory), tap(console.log));
  }

  getEquipmentsStates(): Observable<EquipmentState[]> {
    return this.http.get<MachineMonitor>(this.urlServiceV1).pipe(map((result) => result.equipmentsStates), tap(console.log));
  }

}
