import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  getAllInventorySubject: Subject<any> = new BehaviorSubject([]);
  constructor() { }
  getMyInventoryList(){
    return this.getAllInventorySubject;
  }
}
