import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MembershipService } from 'src/app/services/membership/membership.service';

@Component({
  selector: 'app-edit-membership',
  templateUrl: './edit-membership.component.html',
  styleUrls: ['./edit-membership.component.scss']
})
export class EditMembershipComponent implements OnInit {

  editMembership:FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    evouchers:new FormControl(),
    amount: new FormControl('', Validators.required),
    stocks: new FormControl('', Validators.required)
  });

  inventoryList:any=[];
  vouchersList:any=[];
  membershipDetail:any;
  allVoucherList:any=[];
  constructor(private _activatedRoute:ActivatedRoute, private _inventory:InventoryService, private _membership:MembershipService, private _route:Router, private _dialog:MatDialog) {

    this._activatedRoute.params.subscribe((param:any)=>{
      this._membership.getAllMembership(param.id).subscribe((membershipDetails:any)=>{
        this.membershipDetail = membershipDetails.response;
        this._inventory.getInventoryList().subscribe((inventoryList:any)=>{
          this.inventoryList = inventoryList.response;
        });
        this._membership.getVouchers().subscribe((vouchersRes:any)=>{
          this.allVoucherList = vouchersRes.response;
          this.vouchersList = this.allVoucherList.filter((voucher:any)=>{return voucher.hotelid==this.membershipDetail.hotelid});
        });
        this.editMembership.patchValue({
          title: this.membershipDetail.membershipname,
          description: this.membershipDetail.membershipdesc,
          property: this.membershipDetail.hotelid,
          evouchers: JSON.parse(this.membershipDetail.evouchers),
          amount: this.membershipDetail.amount,
          stocks: this.membershipDetail.stocks,
        });

      })
    });

  }

  ngOnInit(): void {
  }
  savemembership(){
    this._membership.updateMembership({...this.editMembership.value,membershipid:this.membershipDetail.membershipid}).subscribe((membershipRes:any)=>{
      const dialogRef = this._dialog.open(InfoPopupComponent, {
        data: {
          popupText: 'Membership updated successfully',
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
