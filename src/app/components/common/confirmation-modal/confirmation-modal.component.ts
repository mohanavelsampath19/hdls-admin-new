import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  onDelete = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  changeBookingStatus(status:any) {
    this.onDelete.emit(status);
  }
}
