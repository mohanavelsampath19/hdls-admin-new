import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  getAllHotelSubject: BehaviorSubject<HotelDetails[]> = new BehaviorSubject([
    {
      name: 'Suit room',
      type: '1',
      price: 10,
      quantity: 2,
      status: 'Active'
    },
    {
      name: 'deluxe',
      type: '1',
      price: 10,
      quantity: 2,
      status: 'Active'
    },
    {
      name: 'super deluxe',
      type: '1',
      price: 10,
      quantity: 2,
      status: 'Active'
    }
  ]);
  constructor() { }
  getMyHotelsList(){
    return this.getAllHotelSubject;
  }
}

export interface HotelDetails {
  name: string,
  type: string,
  price: number,
  quantity: number,
  status: string
}

