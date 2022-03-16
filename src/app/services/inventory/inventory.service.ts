import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  getAllInventoryList: any = [];
  currentInventory:Subject<any> = new BehaviorSubject([]);
  constructor(private _http:HttpClient) { }


  updateMyInventory(id:number){
    this.currentInventory.next(this.getAllInventoryList[id]);
  }
  getMyInventoryList(){
    return this._http.get(environment.baseUrl + 'api/hotel/gethotellist',{}).subscribe((apiRes:any)=>{
      this.getAllInventoryList = apiRes.response;
      this.currentInventory.next(this.getAllInventoryList[0]);
    })
  }

  getInventoryList(){
    return this._http.get(environment.baseUrl + 'api/hotel/gethotellist',{})
  }

  addProperty(property_details:any) {
    return this._http.post(environment.baseUrl + 'api/rooms/addproperty', property_details)
  }
}

export interface Inventorys {
  property_name: string,
  property_id: number,
  total_rooms: number,
  total_outlet: number,
  status: string
}
