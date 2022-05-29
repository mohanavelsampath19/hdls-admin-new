import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-add-vouchers',
  templateUrl: './add-vouchers.component.html',
  styleUrls: ['./add-vouchers.component.scss']
})
export class AddVouchersComponent implements OnInit {
  isDiscounted:boolean = false;
  newVoucherForm:FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    category:new FormControl(),
    roomType:new FormControl(),
    benefittype:new FormControl(),
    discounttype:new FormControl(),
    discount:new FormControl(),
    evoucherQuantity:new FormControl(),
    isthereanyblockoutdates:new FormControl(),
    tranferable:new FormControl(),
    evoucheractualprice:new FormControl(),
    evoucherpoints:new FormControl(),
    wanttogroupupexistingvoucher:new FormControl(),
    evouchersellingprice:new FormControl(),
  })
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  hotelId: any;
  isRoomBenefit:boolean = false;
  isFB:boolean = false;
  isFacilities:boolean = false;
  isMarketplace:boolean = false;
  myRoomList:any = [];
  existingVoucherList:any = [];
  myCoverImageCheck:boolean = false;
  coverImage:any;
  logo:any;

  constructor(private _vouchers:MembershipService, private _dialog:MatDialog, private _route:Router, private _roomService:RoomsService) {
    this._roomService.getRoomList().subscribe((roomRes:any)=>{
      this.myRoomList = roomRes.response;
      console.log(this.myRoomList);
    });
    this._vouchers.getVouchers().subscribe((vouchersRes:any) => {
      this.existingVoucherList = vouchersRes.response;
    })
  }

  ngOnInit(): void {
  }
  saveVoucher(){
    console.log(this.newVoucherForm.value);
    this._vouchers.addVouchers({...this.newVoucherForm.value,logo:this.logo}).subscribe((voucherRes:any)=>{
      console.log(voucherRes);
      const dialogRef = this._dialog.open(InfoPopupComponent, {
        data: {
          popupText: 'Vouchers created successfully',
        },
      });
      this._route.navigate(['/vouchers']);
      dialogRef.afterClosed().subscribe(() => {
      });
    });
  }
  changeCategory(e:any){
    this.isRoomBenefit= false;
    this.isFB= false;
    this.isFacilities= false;
    this.isMarketplace= false;
    switch(e.value){
      case 'room':
        this.isRoomBenefit = true;
      break;
      case 'fb':
        this.isFB = true;
      break;
      case 'facilities':
        this.isFacilities = true;
      break;
      case 'marketplace':
        this.isMarketplace = true;
      break;
    }
  }
  changeBenefitType(e:any){
    if(e.value === 'complementary'){
      this.isDiscounted = false;
    }else{
      this.isDiscounted = true;
    }
  }

  coverFileChange(event:any){
    var reader = new FileReader();
    this.myCoverImageCheck = true;
    reader.onload = e => this.coverImage = reader.result;
    this.logo = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }
}
