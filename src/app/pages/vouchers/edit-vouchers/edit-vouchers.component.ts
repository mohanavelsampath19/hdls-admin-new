import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-edit-vouchers',
  templateUrl: './edit-vouchers.component.html',
  styleUrls: ['./edit-vouchers.component.scss']
})
export class EditVouchersComponent implements OnInit {
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
    evoucherexpiry: new FormControl(),
    expirydays: new FormControl()
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
  voucherId:any;

  constructor(private _vouchers:MembershipService, private _dialog:MatDialog, private _route:Router, private _roomService:RoomsService, private _activateRoute: ActivatedRoute) {
    this._roomService.getRoomList().subscribe((roomRes:any)=>{
      this.myRoomList = roomRes.response;
      console.log(this.myRoomList);
    });
    this._vouchers.getVouchers().subscribe((vouchersRes:any) => {
      this.existingVoucherList = vouchersRes.response;
    })
  }

  ngOnInit(): void {
    this._activateRoute.params.subscribe((param:any)=>{
    let id = param?.id;
    this._vouchers.getVoucherDetails(parseInt(id)).subscribe((res:any) => {
      if(res && res.response) {
        let groupingValue = res && res.response && res.response.grouping ? res.response.grouping.split(",").map((res:any) => parseInt(res)) : [];
        this.newVoucherForm.patchValue({
          title: res?.response?.voucherstitle,
          description: res?.response?.voucherdesc,
          category:res?.response?.category,
          roomType:res?.response?.roomtype,
          benefittype:res?.response?.benefittype,
          discounttype:res?.response?.discounttype,
          discount:res?.response?.discount,
          evoucherQuantity:res?.response?.quantity,
          isthereanyblockoutdates:res?.response?.blockoutdays,
          tranferable:res?.response?.transfer,
          evoucheractualprice:res?.response?.actualprice,
          evoucherpoints:res?.response?.points,
          wanttogroupupexistingvoucher:groupingValue,
          evouchersellingprice:res?.response?.sellingprice,
          evoucherexpiry: res?.response?.expiry_no,
          expirydays: res?.response?.expiry_type
        })
        this.voucherId = res?.response?.vouchersid
      }
    })
  });

  }
  saveVoucher(){
    console.log(this.newVoucherForm.value);
    this._vouchers.updateVouchers(this.newVoucherForm.value, this.voucherId).subscribe((voucherRes:any)=>{
      console.log(voucherRes);
      const dialogRef = this._dialog.open(InfoPopupComponent, {
        data: {
          popupText: 'Vouchers updated successfully',
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
