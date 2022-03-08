import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  getAllInventorySubject: BehaviorSubject<Inventorys[]> = new BehaviorSubject([
    {
      property_name: 'taj hotel',
      property_id: 1,
      total_rooms: 10,
      total_outlet: 2,
      status: 'Active'
    },
    {
      property_name: 'taj hotel',
      property_id: 1,
      total_rooms: 10,
      total_outlet: 2,
      status: 'Active'
    },
    {
      property_name: 'taj hotel',
      property_id: 1,
      total_rooms: 10,
      total_outlet: 2,
      status: 'Active'
    }
  ]);
  constructor() { }
  getMyInventoryList(){
    return this.getAllInventorySubject;
  }
}

export interface Inventorys {
  property_name: string,
  property_id: number,
  total_rooms: number,
  total_outlet: number,
  status: string
}
