import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private _http:HttpClient) { 
    
  }
  getUserList() {
    return this._http.get(environment.baseUrl + 'api/report/getuserlist');
  }
  getMembershipPurchase() {
    return this._http.get(environment.baseUrl + 'api/report/getmembershippurchase');
  }
  getTransactionDetails() {
    return this._http.get(environment.baseUrl + 'api/report/gettransactions');
  }
}
