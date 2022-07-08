import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-vouchers',
  templateUrl: './edit-vouchers.component.html',
  styleUrls: ['./edit-vouchers.component.scss']
})
export class EditVouchersComponent implements OnInit {
  isDiscounted:boolean = false;

  newVoucherForm:FormGroup = new FormGroup({
    title: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    category:new FormControl(),
    roomType:new FormControl(),
    benefittype:new FormControl(),
    discounttype:new FormControl(),
    discount:new FormControl(),
    evoucherQuantity:new FormControl(),
    isthereanyblockoutdates:new FormControl(),
    tranferable:new FormControl(),
    evoucheractualprice:new FormControl('',Validators.required),
    evoucherpoints:new FormControl(),
    wanttogroupupexistingvoucher:new FormControl(),
    evouchersellingprice:new FormControl('',Validators.required),
    propertyid:new FormControl('',Validators.required),
    evoucherexpiry: new FormControl(),
    expirydays: new FormControl()
  });
  currentProperty:string='';
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
  inventoryList:any;
  fbList:any;
  facilityList:any;
  marketplaceList:any;
  voucherId:any;
  editor:any;
  @ViewChild('myCoverImage', { static: false })
  myCoverImage!: ElementRef;
  constructor(private _vouchers:MembershipService,
    private _dialog:MatDialog, private _route:Router,
     private _roomService:RoomsService, private _inventory:InventoryService,
     private _facility:FacilitiesService,
     private _activateRoute: ActivatedRoute) {
    this._roomService.getRoomList().subscribe((roomRes:any)=>{
      this.myRoomList = roomRes.response;
      console.log(this.myRoomList);
    });
    this._vouchers.getVouchers().subscribe((vouchersRes:any) => {
      this.existingVoucherList = vouchersRes.response;
    });
    this._inventory.getInventoryList().subscribe((inventoryList:any)=>{
      this.inventoryList = inventoryList.response;
    });
    this.getFacilityDetails();
  }

  ngOnInit(): void {
    this._activateRoute.params.subscribe((param:any)=>{
    let id = param?.id;
    this._vouchers.getVoucherDetails(parseInt(id)).subscribe((res:any) => {
      console.log(res.response);
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
          expirydays: res?.response?.expiry_type,
        });
        this.newVoucherForm.patchValue({propertyid:res.response.hotelid});
        this.voucherId = res?.response?.vouchersid;
        this.coverImage = environment.imageUrl+"/"+res?.response?.logo;
        this.myCoverImageCheck = this.logo!=''?true:false;
      }
    })
  });

  }
  saveVoucher(){
    console.log(this.newVoucherForm.value);
    this._vouchers.updateVouchers({...this.newVoucherForm.value,logo:this.logo}, this.voucherId).subscribe((voucherRes:any)=>{
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
      case 'f&b':
        this.isFB = true;
      break;
      case 'facilities':
        this.isFacilities = true;
      break;
      case 'marketplace':
        this.isMarketplace = true;
      break;
    }
    this.newVoucherForm.patchValue({roomType:''});
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
  getFacilityDetails(hotelId?:number){
    this._facility.getAllFacility(0,hotelId).subscribe((facility:any)=>{
      let facilityList = facility.response;
      this.fbList = facilityList.filter((inventory:any)=>inventory.facility_type=='f&b');
      this.facilityList = facilityList.filter((inventory:any)=>inventory.facility_type=='facility');
      this.marketplaceList = facilityList.filter((inventory:any)=>inventory.facility_type=='marketplace');
    });
  }
  inventoryChange(e:any){
    console.log(e);
    this.currentProperty = e.value;
    this.getFacilityDetails(e.value);
    this._roomService.getRoomList(e.value).subscribe((roomRes:any)=>{
      this.myRoomList = roomRes.response;
    });
  }

  clearSelectedFile(){
    this.myCoverImage.nativeElement.value = '';
    this.myCoverImageCheck = false;
  }

  cancelVoucher() {
    this._route.navigate(['/vouchers']);
  }
}
