import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private _http: HttpClient) { }
  getBookingHistory(status:any) {
    return this._http.post(environment.baseUrl + 'api/booking/getbookinglist',{
      status: status
    });
  }

  changeBookingStatus(bookingid:any,status:any,reason?:any) {
    return this._http.post(environment.baseUrl + 'api/booking/bookingstatuschange', {
      bookingid,
      status,
      reason
    })
  }

  getUserBookingHistory(user_id:any) {
    return this._http.get(environment.baseUrl + `api/booking/getbookinghistory?userId=${user_id}`);
  }

  getHotelBookingHistory(hotelid:any, from_date:any, to_date:any) {
    return this._http.post(environment.baseUrl + 'api/booking/gethotelbookinghistory',{
      hotelid,
      from_date,
      to_date
    });
  }

  getBookingDetailsBasedOnId(bookingid:any) {
    return this._http.get(environment.baseUrl + `api/booking/bookingInfo?bookingId=${bookingid}`);
  }

  getBookingHistoryById(booking_id:any) {
    return this._http.get(environment.baseUrl + `api/booking/getbookinghistorybyId?userId=${booking_id}`);
  }
}
