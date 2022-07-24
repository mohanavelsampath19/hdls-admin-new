import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingsService } from 'src/app/services/bookings/bookings.service';

@Component({
  selector: 'app-scan-modal',
  templateUrl: './scan-modal.component.html',
  styleUrls: ['./scan-modal.component.scss']
})
export class ScanModalComponent implements OnInit {
  bookingInfoDetails:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _bookingService:BookingsService) { 
    let scanData = JSON.parse(this.data.bookingDetails.body);
    this.bookingInfoDetails = scanData;
  }

  ngOnInit(): void {
  }
  updateCheckIn(){
    this._bookingService.changeBookingStatus(this.bookingInfoDetails.bookingid,3).subscribe((bookingUpdate:any)=>{
      console.log(bookingUpdate);
    })
  }
}
