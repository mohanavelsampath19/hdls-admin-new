import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    evouchers:new FormControl(),
    amount: new FormControl('', Validators.required),
    stocks: new FormControl('', Validators.required)
  });

  inventoryList:any;
  vouchersList:any=[];
  allVoucherList:any;
  constructor(private _inventory:InventoryService, private _membership:MembershipService, private _route:Router, private _dialog:MatDialog) {
    this._inventory.getInventoryList().subscribe((inventoryList:any)=>{
      this.inventoryList = inventoryList.response;
    });
    this._membership.getVouchers().subscribe((vouchersRes:any)=>{
      this.vouchersList = vouchersRes.response;
      this.allVoucherList = vouchersRes.response;
    })
  }

  ngOnInit(): void {
  }
  savemembership(){
    console.log(this.newMembership.valid, this.newMembership.value)
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
  changeMembership(event:any){
    console.log(event);
    this.vouchersList = this.allVoucherList.filter((voucher:any)=>{return voucher.hotelid==event.value});
  }
}
