import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-vouchers',
  templateUrl: './add-vouchers.component.html',
  styleUrls: ['./add-vouchers.component.scss']
})
export class AddVouchersComponent implements OnInit {

  newMembership:FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    addbenefits:new FormControl(),
    uploadevouchersimage:new FormControl(),
    isthereanyblockoutdates:new FormControl(),
    expiryvalidity:new FormControl(),
    tranferable:new FormControl(),
    evoucheractualprice:new FormControl(),
    evoucherpoints:new FormControl(),
    wanttogroupupexistingvoucher:new FormControl(),
    evouchersellingprice:new FormControl(),
    conditions:new FormControl(),
    upgrade:new FormControl(),
    save:new FormControl()
  })
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor() { }

  ngOnInit(): void {
  }

}
