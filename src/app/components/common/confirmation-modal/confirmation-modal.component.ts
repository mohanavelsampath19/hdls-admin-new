import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  currentDate= new Date();
  onDelete = new EventEmitter();
  reason:any = '';
  errorMsg:any = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
  }

  ngOnInit(): void {
    console.log(this.reason, '----')
  }

  isRejected(status:any) {
    if(this.reason === '') {
      this.errorMsg = true;
    } else {
      this.errorMsg = false;
      let details = {
        status: status,
        reason: this.reason
      }
      console.log(details, '---')
      this.onDelete.emit(details);
    }
  }
  changeBookingStatus(status:any) {
    let details = {
      status: status,
      reason: this.reason
    }
    this.onDelete.emit(details);
  }
}
