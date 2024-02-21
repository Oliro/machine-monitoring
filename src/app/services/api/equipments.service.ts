import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Equipment } from '../../models/equipment';
import { EquipmentModel } from '../../models/equipment-model';
import { EquipmentPositionHistory } from '../../models/equipment-position-history';
import { EquipmentStateHistory } from '../../models/equipment-state-history';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService extends BaseService {

  constructor(private http: HttpClient) { super(); }

  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.urlServiceV1 + 'equipments')
  }

  getEquipmentsModels(): Observable<EquipmentModel[]> {
    return this.http.get<EquipmentModel[]>(this.urlServiceV1 + 'equipmentsModels')
  }

  getEquipmentsPositionHistory(): Observable<EquipmentPositionHistory[]> {
    return this.http.get<EquipmentPositionHistory[]>(this.urlServiceV1 + 'equipmentsPositionHistory')
  }

  getEquipmentsStatesHistory(): Observable<EquipmentStateHistory[]> {
    return this.http.get<EquipmentStateHistory[]>(this.urlServiceV1 + 'equipmentsStatesHistory')
  }

}
