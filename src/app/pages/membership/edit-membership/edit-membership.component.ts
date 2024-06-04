import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

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
  imageChangedEvent: any = '';
  croppedImage: any = '';
  myCoverImageCheck:boolean = false;
  coverImage:any;
  logo:any;
  base64String: any;

  constructor(private _activatedRoute:ActivatedRoute, private _inventory:InventoryService, private _membership:MembershipService, private _route:Router, private _dialog:MatDialog) {

    this._activatedRoute.params.subscribe((param:any)=>{
      this._membership.getAllMembership(param.id).subscribe((membershipDetails:any)=>{
        console.log(membershipDetails);
        this.membershipDetail = membershipDetails.response;
        this.getBase64(this.membershipDetail.image_url);
        this._inventory.getInventoryList().subscribe((inventoryList:any)=>{
          this.inventoryList = inventoryList.response;
        });
        this._membership.getVouchers().subscribe((vouchersRes:any)=>{
          this.allVoucherList = vouchersRes.response;
          this.vouchersList = this.allVoucherList;
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
    this._membership.updateMembership({...this.editMembership.value,membershipid:this.membershipDetail.membershipid,image_url:this.base64String}).subscribe((membershipRes:any)=>{
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
  getBase64(imgUrl:any) {
    const self = this;
    var xhr = new XMLHttpRequest();
    xhr.open("get", imgUrl, true);
    // Essential
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (this.status == 200) {
        //Get a blob objects
        var blob = this.response;
        console.log("blob", blob)
        //  Essential
        let oFileReader = new FileReader();
        oFileReader.onloadend = function (e) {
          let base64 = e.target;
          self.base64String = (<any>base64).result;
        };
        oFileReader.readAsDataURL(blob);
        //==== In order to display the picture on the page, you can delete ====
        // var img = document.createElement("img");
        // img.onload = function (e) {
        //   window.URL.revokeObjectURL(img.src); //  Clear release
        // };
        let membershipImageUrl = window.URL.createObjectURL(blob);
        self.membershipDetail.image_url = membershipImageUrl;
        // document.getElementById("container1").appendChild(img);
        //==== In order to display the picture on the page, you can delete ====

      }
    }
    xhr.send();
  }
}
