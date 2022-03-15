import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  getAllInventoryList: any = [];
  currentInventory:Subject<any> = new BehaviorSubject([]);
  constructor(private _http:HttpClient) { }
  getMyInventoryList(){
    this._http.get(`${environment.apiurl}hotel/gethotellist`).subscribe((apiRes:any)=>{
      this.getAllInventoryList = apiRes.response;
      this.currentInventory.next(this.getAllInventoryList[0]);
    });
  }
  
  updateMyInventory(id:number){
    this.currentInventory.next(this.getAllInventoryList[id]);
  }
}
