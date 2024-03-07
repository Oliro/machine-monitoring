import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Equipment } from '../../models/equipment';
import { EquipmentModel } from '../../models/equipment-model';
import { EquipmentPositionHistory } from '../../models/equipment-position-history';
import { EquipmentStateHistory } from '../../models/equipment-state-history';
import { EquipmentState } from '../../models/equipment-state';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService extends BaseService {

  constructor(private http: HttpClient) { super(); }

  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.urlServiceV1)
  }

  getEquipmentsModels(): Observable<EquipmentModel[]> {
    return this.http.get<EquipmentModel[]>(this.urlServiceV1)
  }

  getEquipmentsPositionHistory(): Observable<EquipmentPositionHistory[]> {
    return this.http.get<EquipmentPositionHistory[]>(this.urlServiceV1)
  }

  getEquipmentsStatesHistory(): Observable<EquipmentStateHistory[]> {
    return this.http.get<EquipmentStateHistory[]>(this.urlServiceV1)
  }

  getEquipmentsStates(): Observable<EquipmentState[]> {
    return this.http.get<EquipmentState[]>(this.urlServiceV1)
  }

}
