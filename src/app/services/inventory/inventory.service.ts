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
  getMyInventoryList(category:number){
    return this._http.get(environment.baseUrl + 'api/hotel/gethotellist?activetype='+category).subscribe((apiRes:any)=>{
      this.getAllInventoryList = apiRes.response;
      this.currentInventory.next(this.getAllInventoryList[0]);
    })
  }

  getInventoryList(category?:number){
    let type = category !== undefined ? category : 1;
    return this._http.get(environment.baseUrl + 'api/hotel/gethotellist?activetype='+type)
  }
  getPointSummary(userId:number){
    return this._http.post(environment.baseUrl + 'api/hotel/getpointsummary', { customer_id:userId });
  }
  deleteHotel(hotelId:number){
    return this._http.post(environment.baseUrl + 'api/hotel/deletehotel',{hotelId:hotelId});
  }

  addProperty(property_details:any) {
    let formData = this.makeFormData(property_details);
    return this._http.post(environment.baseUrl + 'api/hotel/addproperty', formData);
  }

  updateProperty(property_details:any, propertyid?:any) {
    let formData = this.makeFormData(property_details, propertyid);
    return this._http.post(environment.baseUrl + 'api/hotel/updateproperty', formData);
  }

  getPropertyDetail(propertyid:any) {
    return this._http.post(environment.baseUrl + 'api/hotel/getpropertydetail', {propertyid})
  }
  makeFormData(propertyDetails:any, id?:any){
    let formKeys = Object.keys(propertyDetails);
    let formValues:any = Object.values(propertyDetails);
    let formData = new FormData();
    formKeys.forEach((formItem:any,i)=>{
      if(formItem == 'logo' && formValues[i]){
        formData.append('logo', formValues[i], formValues[i].name);
      }else{
        formData.append(formItem, formValues[i]);
      }
    });
    if(id) {
      formData.append('id', id)
    }
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
