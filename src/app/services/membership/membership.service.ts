import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  getAllMembershipSubject: BehaviorSubject<MemberShip[]> = new BehaviorSubject([
    {
      membership_name: 'Bronze',
      price: 200,
      stock: 10,
      status: 'Active'
    },
    {
      membership_name: 'Silver',
      price: 200,
      stock: 10,
      status: 'InActive'
    },
    {
      membership_name: 'Gold',
      price: 200,
      stock: 10,
      status: 'Active'
    }, {
      membership_name: 'Platinum',
      price: 200,
      stock: 10,
      status: 'InActive'
    }
  ])


  constructor(private _http:HttpClient) { }

  getAllMembership() {
    return this._http.get(environment.baseUrl+ 'api/membership/getmembership');
  }
  deleteMembership(membershipid:number){
    return this._http.post(environment.baseUrl+ 'api/membership/deletemembership',{membershipid:membershipid});
  }
  addVouchers(voucherDetails:any) {
    let formData = this.makeFormData(voucherDetails);
    return this._http.post(environment.baseUrl + 'api/vouchers/createvouchers', formData);
  }
  addMembership(membershipDetails:any){
    return this._http.post(environment.baseUrl+ 'api/membership/creatememberships',{...membershipDetails});
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
        formData.append('logo', formValues[i], formValues[i].name);
      }else{
        formData.append(formItem, formValues[i]);
      }
    });
    return formData;
  }
}

export interface MemberShip {
  membership_name: string,
  price: number,
  stock: number,
  status: string,
  isLoading?: boolean
}
