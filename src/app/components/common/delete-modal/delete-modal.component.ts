import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  onDelete = new EventEmitter();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  ngOnInit(): void {}

  deleteProduct() {
    this.data.status = 'Delete';
    this.onDelete.emit('delete');
  }
}
