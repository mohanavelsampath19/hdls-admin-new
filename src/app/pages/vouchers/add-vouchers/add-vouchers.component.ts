import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { PointsTableComponent } from 'src/app/components/common/points-table/points-table.component';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-add-vouchers',
  templateUrl: './add-vouchers.component.html',
  styleUrls: ['./add-vouchers.component.scss']
})
export class AddVouchersComponent implements OnInit {
  isDiscounted:boolean = false;
  dayPercentList:any = [];
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
    evoucheractualprice:new FormControl('',Validators.required),
    evoucherpoints:new FormControl(),
    wanttogroupupexistingvoucher:new FormControl(''),
    evouchersellingprice:new FormControl('',Validators.required),
    evoucherexpiry: new FormControl(),
    expirydays: new FormControl(),
    tranferable: new FormControl('', Validators.required),
    minDay: new FormControl('',Validators.required)
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
  touristplacesList:any;
  isTouristPlaces:boolean = false;
  editor:any;
  @ViewChild('myCoverImage', { static: false })
  myCoverImage!: ElementRef;
  constructor(private _vouchers:MembershipService, private _dialog:MatDialog, private _route:Router, private _roomService:RoomsService, private _inventory:InventoryService, private _facility:FacilitiesService) {
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

  }
  saveVoucher(){
    this._vouchers.addVouchers({...this.newVoucherForm.value,logo:this.logo, voucherDays:JSON.stringify([...this.dayPercentList])}).subscribe((voucherRes:any)=>{
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

  cancelVoucher() {
    this._route.navigate(['/vouchers']);
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
      case 'tourist_places':
        this.isTouristPlaces = true;
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
    console.log(this.newVoucherForm.valid, this.myCoverImageCheck, '----')
  }
  getFacilityDetails(hotelId?:number){
    this._facility.getAllFacility(0,hotelId).subscribe((facility:any)=>{
      let facilityList = facility.response;
      this.fbList = facilityList && facilityList.filter((inventory:any)=>inventory.facility_type=='f&b');
      this.facilityList = facilityList && facilityList.filter((inventory:any)=>inventory.facility_type=='facility');
      this.marketplaceList = facilityList && facilityList.filter((inventory:any)=>inventory.facility_type=='marketplace');
      this.touristplacesList = facilityList && facilityList.filter((inventory:any)=>inventory.facility_type=='tourist_places');
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
  openVoucherModal(){
    let voucherDialogRef = this._dialog.open(PointsTableComponent, {
      data: {
        daysPercent:[...this.dayPercentList]
      },
    });
    voucherDialogRef.afterClosed().subscribe((closeRes:any)=>{
      console.log(closeRes);
      if(closeRes?.status == 'added successfully'){
        this.dayPercentList = [...closeRes.voucherDays];
      }
    })
  }
}
