import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {
  


  constructor(private _http:HttpClient) { }

  getAllFacility(facilitiesId?:number,hotelId?:number) {
    if(facilitiesId!=0 && facilitiesId){
      return this._http.get(environment.baseUrl+ 'api/facilities/getfacility?facilityId='+facilitiesId);
    }else{
      if(hotelId){
        return this._http.get(environment.baseUrl+ 'api/facilities/getfacility?hotelId='+hotelId);
      }else{
        return this._http.get(environment.baseUrl+ 'api/facilities/getfacility');
      }
    }
  }

  getAllMembersByCategory(type:any) {
    return this._http.post(environment.baseUrl+'api/facilities/getfacilitybycategory', {
      type
    })
  }
  
  addFacility(facilitiesDetails:any){
    let formData = this.makeFormData(facilitiesDetails);
    return this._http.post(environment.baseUrl+ 'api/facilities/createfacility',formData);
  }
  updateFacility(facilitiesDetails:any){
    let formData = this.makeFormData(facilitiesDetails);
    return this._http.post(environment.baseUrl+ 'api/facilities/updatefacility',formData);
  }
  deleteFacility(facilityId:number){
    return this._http.post(environment.baseUrl+ 'api/facilities/deletefacility',{facilityId:facilityId});
  }
  getVouchers(){
    return this._http.get(environment.baseUrl + 'api/vouchers/getvouchers');
  }
  makeFormData(voucherDetails:any){
    let formKeys = Object.keys(voucherDetails);
    let formValues:any = Object.values(voucherDetails);
    let formData = new FormData();
    formKeys.forEach((formItem:any,i)=>{
      if(formItem == 'logo'){
        if(formValues[i]){
          formData.append('logo', formValues[i], formValues[i].name);
        }
      }else{
        formData.append(formItem, formValues[i]);
      }
    });
    return formData;
  }
  
}
