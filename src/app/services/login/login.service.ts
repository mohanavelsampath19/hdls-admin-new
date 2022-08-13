import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http:HttpClient) { 

  }
  login(username:any,password:string){
    return this._http.post(environment.baseUrl + 'api/hoteluser/login', {username,password:btoa(password)});
  }
  updateToken(userid:any,userToken:string){
    return this._http.post(environment.baseUrl + 'api/hoteluser/updatetoken', {userid,loginToken:userToken});
  }
}
