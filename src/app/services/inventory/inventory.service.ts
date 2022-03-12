import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  getAllInventorySubject: BehaviorSubject<Inventorys[]> = new BehaviorSubject([
    {
      property_name: 'Taj hotel',
      property_id: 1,
      total_rooms: 10,
      total_outlet: 2,
      status: 'Active'
    },
    {
      property_name: 'ITC',
      property_id: 1,
      total_rooms: 10,
      total_outlet: 2,
      status: 'Active'
    },
    {
      property_name: 'Oberai',
      property_id: 1,
      total_rooms: 10,
      total_outlet: 2,
      status: 'Active'
    }
  ]);
  constructor(private _http: HttpClient) { }
  getMyInventoryList(){
    return this._http.post(environment.baseUrl + 'api/hotel/gethotellist', {

    })
  }

  addProperty(property_details:any) {
    return this._http.post(environment.baseUrl + 'api/rooms/addproperty', property_details)
  }
}

export interface Inventorys {
  property_name: string,
  property_id: number,
  total_rooms: number,
  total_outlet: number,
  status: string
}
