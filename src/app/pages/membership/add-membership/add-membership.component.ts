import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-membership',
  templateUrl: './add-membership.component.html',
  styleUrls: ['./add-membership.component.scss']
})
export class AddMembershipComponent implements OnInit {

  newMembership:FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    property:new FormControl(),
    evouchers:new FormControl(),
    cancel:new FormControl(),
    next:new FormControl()
  })
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor() { }

  ngOnInit(): void {
  }

}
