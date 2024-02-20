import { Injectable } from '@angular/core';
import { EquipmentsService } from '../../services/api/equipments.service';
import { EquipmentsState } from '../../services/states/equipments.state';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  constructor(private api: EquipmentsService, private state: EquipmentsState) { }

  equipments$ = this.state.equipments$;

  load() {
    return this.api.getAll().subscribe((equipments) => this.state.getEquipment(equipments))
  }

}
