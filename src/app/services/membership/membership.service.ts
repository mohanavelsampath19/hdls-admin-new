import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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


  constructor() { }

  getAllMembership() {
    return this.getAllMembershipSubject
  }
}

export interface MemberShip {
  membership_name: string,
  price: number,
  stock: number,
  status: string,
  isLoading?: boolean
}
