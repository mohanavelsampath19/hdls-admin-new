import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MembershipService } from 'src/app/services/membership/membership.service';

@Component({
  selector: 'app-coupon-generate',
  templateUrl: './coupon-generate.component.html',
  styleUrls: ['./coupon-generate.component.scss']
})
export class CouponGenerateComponent implements OnInit {
  couponGenerateForm:FormGroup = new FormGroup({
    count: new FormControl('',[Validators.required]),
    membershipList: new FormControl([],[Validators.required]),
  });
  tribeMembershipList:any = []; 
  loading:boolean = false;
  constructor(private _membershipService:MembershipService, private _dialog:MatDialog, private _snackbar: MatSnackBar,) { 
    
    this._membershipService.getTribeMembershipList().subscribe((membershipList:any)=>{
      this.tribeMembershipList = membershipList.response;
    });
  }

  ngOnInit(): void {
  }
  generateCoupon(){
    this.loading = true;
    this._membershipService.generateMembershipCoupon({...this.couponGenerateForm.value}).subscribe((res:any)=>{
      console.log(res);
      this.loading = false;
      this.closePopup();
      this._snackbar.open('Coupon generated successfully', 'dismiss');
    });
  }
  closePopup(){
    this._dialog.closeAll();
  }
}
