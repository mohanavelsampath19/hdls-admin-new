import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
const listentScanPopup = new BroadcastChannel('listenScanPopup');
@Component({
  selector: 'app-scan-facility-modal',
  templateUrl: './scan-modal-facility.component.html',
  styleUrls: ['./scan-modal-facility.component.scss']
})
export class ScanModalFacilityComponent implements OnInit {
  scanInfoList:any=[];
  isFacilityVoucherAvail:boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _facilitiesService:FacilitiesService, private _dialog:MatDialog) { 
    let scanData = JSON.parse(this.data.bookingDetails.body) || this.data.bookingDetails.body;
    this.scanInfoList = [...scanData];
    console.log(scanData);
    if(this.isFacilityVoucherAvail == true){

    }
  }

  ngOnInit(): void {
    
  }
  redeemVoucher(voucherRedeemId:number){
    this._facilitiesService.updateCustomerVoucherStatus(voucherRedeemId,1).subscribe((apiRes:any)=>{
      console.log(apiRes);
      this._dialog.closeAll();
    })
  } 
}
