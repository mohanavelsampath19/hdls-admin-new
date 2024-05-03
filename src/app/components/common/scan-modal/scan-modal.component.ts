import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
const listentScanPopup = new BroadcastChannel('listenScanPopup');
@Component({
  selector: 'app-scan-modal',
  templateUrl: './scan-modal.component.html',
  styleUrls: ['./scan-modal.component.scss']
})
export class ScanModalComponent implements OnInit {
  bookingInfoList:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _bookingService:BookingsService, private _dialog:MatDialog) { 
    let scanData = JSON.parse(this.data.bookingDetails.body) || this.data.bookingDetails.body;
    this.bookingInfoList = [...scanData];
  }

  ngOnInit(): void {
    let scanData = JSON.parse(this.data.bookingDetails.body) || this.data.bookingDetails.body;
    this.bookingInfoList = [...scanData];
  }
  updateCheckIn(bookingId:number){
    this._bookingService.changeBookingStatus(bookingId,3).subscribe((bookingUpdate:any)=>{
      console.log(bookingUpdate);
    });
    this.bookingInfoList = [...this.bookingInfoList].filter((bookingItem:any)=>{
      return bookingItem.bookingid != bookingId
    });
    if(this.bookingInfoList.length==0){
      this._dialog.closeAll();
    }
  }
}
