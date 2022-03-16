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
}
