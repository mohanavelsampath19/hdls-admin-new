import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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
  constructor(private _http: HttpClient) { }
  getMyHotelsList(hotel_name:any){
    return this._http.post(environment.baseUrl + 'api/rooms/getroomdetails', {
      roomid: hotel_name
    })
  }

  getRoomDetails(room_id:any) {
    return this._http.post(environment.baseUrl + 'api/rooms/getroomdetailbyid', {
      roomid: room_id
    })
  }
}

export interface HotelDetails {
  name: string,
  type: string,
  price: number,
  quantity: number,
  status: string
}

