import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  onDelete = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  deleteProduct() {
    this.onDelete.emit('delete');
  }
}
