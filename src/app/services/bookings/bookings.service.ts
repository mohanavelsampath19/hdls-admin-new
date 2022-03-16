import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private _http: HttpClient) { }
  getBookingHistory() {
    return this._http.get(environment.baseUrl + 'api/booking/getbookinglist',{});
  }

  changeBookingStatus(bookingid:any,status:any, ) {
    return this._http.post(environment.baseUrl + 'api/booking/bookingstatuschange', {
      bookingid,
      status
    })
  }
}
