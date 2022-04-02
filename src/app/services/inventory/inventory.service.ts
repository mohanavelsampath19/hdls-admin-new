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
  deleteHotel(hotelId:number){
    return this._http.post(environment.baseUrl + 'api/hotel/deletehotel',{hotelId:hotelId});
  }

  addProperty(property_details:any) {
    let formData = this.makeFormData(property_details);
    return this._http.post(environment.baseUrl + 'api/rooms/addproperty', formData);
  }
  makeFormData(propertyDetails:any){
    let formKeys = Object.keys(propertyDetails);
    let formValues:any = Object.values(propertyDetails);
    let formData = new FormData();
    formKeys.forEach((formItem:any,i)=>{
      if(formItem == 'logo'){
        formData.append('coverImage', formValues[i], formValues[i].name);
      }else{
        formData.append(formItem, formValues[i]);
      }
    });
    return formData;
  }
}

export interface Inventorys {
  property_name: string,
  property_id: number,
  total_rooms: number,
  total_outlet: number,
  status: string
}
