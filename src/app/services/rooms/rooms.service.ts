import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private _http: HttpClient) { }
  addRoomService(roomdetails:any) {
    return this._http.post(environment.baseUrl + 'api/rooms/createrooms', roomdetails);
  }
}
