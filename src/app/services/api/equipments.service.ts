import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Equipment } from '../../models/equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService extends BaseService {

  constructor(private http: HttpClient) { super(); }

  getAll(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.urlServiceV1 + 'equipment')
    .pipe(tap(console.log))
  }

}
