import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  constructor(private _http: HttpClient) {}

  getPointDetails(_id: number, _value: any) {
    return this._http.post(environment.baseUrl + 'api/points/getpointdetails', {
      id: _id,
      value: _value,
    });
  }

  updatePointMultiplier(_id: number, _value: any) {
    return this._http.post(
      environment.baseUrl + 'api/points/updatepointmultiplier',
      { id: _id, value: _value }
    );
  }
}
