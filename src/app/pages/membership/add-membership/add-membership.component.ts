import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';


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
    stocks: new FormControl('', Validators.required),
    isOwnerVoucher: new FormControl('', Validators.required),
  });
  
  inventoryList:any;
  vouchersList:any=[];
  allVoucherList:any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  myCoverImageCheck:boolean = false;
  coverImage:any;
  logo:any;
  base64String: any;
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
  coverFileChange(event:any){
    var reader = new FileReader();
    this.myCoverImageCheck = true;
    reader.onload = e => this.coverImage = reader.result;
    this.logo = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }
  savemembership(){
    console.log(this.newMembership.valid, this.newMembership.value)
    this._membership.addMembership({...this.newMembership.value,image_url:this.base64String}).subscribe((membershipRes:any)=>{
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
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.base64String = this.croppedImage;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
}
