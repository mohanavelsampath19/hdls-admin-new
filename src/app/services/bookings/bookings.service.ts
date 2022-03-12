import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private _http: HttpClient) { }
  getBookingHistory(id:any) {
    return this._http.post(environment.baseUrl + 'api/booking/getbookinghistory', {id});
  }
}
