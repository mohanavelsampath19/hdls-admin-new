import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MembershipService } from 'src/app/services/membership/membership.service';

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
    amount: new FormControl(),
    stocks: new FormControl()
  });
  
  inventoryList:any;
  vouchersList:any;
  constructor(private _inventory:InventoryService, private _membership:MembershipService, private _route:Router, private _dialog:MatDialog) { 
    this._inventory.getInventoryList().subscribe((inventoryList:any)=>{
      this.inventoryList = inventoryList.response;
    });
    this._membership.getVouchers().subscribe((vouchersRes:any)=>{
      this.vouchersList = vouchersRes.response;
    })
  }

  ngOnInit(): void {
  }
  savemembership(){
    
    this._membership.addMembership({...this.newMembership.value}).subscribe((membershipRes:any)=>{
      console.log(membershipRes);
      const dialogRef = this._dialog.open(InfoPopupComponent, {
        data: {
          popupText: 'Membership created successfully',
        },
      });
      this._route.navigate(['/membership']);
      dialogRef.afterClosed().subscribe(() => {
      });
    })
  }
  backToMembership(){
    this._route.navigate(['/membership']);
  }
}
