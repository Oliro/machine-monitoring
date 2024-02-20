import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Equipment } from '../../models/equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsState {

  private _equipments = new BehaviorSubject<Equipment[]>([]);

  equipments$ = this._equipments.asObservable();

  constructor() { }

}
