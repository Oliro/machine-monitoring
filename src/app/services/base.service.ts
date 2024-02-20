import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected urlServiceV1: string = environment.apiUrlv1;

  constructor() { }

}
