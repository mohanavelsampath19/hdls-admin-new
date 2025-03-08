import { Component, EventEmitter, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PointsTableComponent } from '../points-table/points-table.component';

@Component({
  selector: 'app-viewexpenses',
  templateUrl: './viewexpenses.component.html',
  styleUrls: ['./viewexpenses.component.scss']
})
export class ViewexpensesComponent implements OnInit {
  myExpenseList:any = [];
  isAvailable:boolean = false;
  enableExpenseForm:boolean = false;
  isErrorMsg:boolean = false;
  isLoading:boolean = false;
  readonly dialogRef = inject(MatDialogRef<PointsTableComponent>);
  closePopup = new EventEmitter();
  viewExpenseList:Array<any> = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  closeModalPopup() {
    this.closePopup.emit();
  }
  addRow(){
    this.enableExpenseForm = true;
  }
  
  closeModal(){
    this.dialogRef.close();
  }
  saveExpenses(){

  }
  clearExpenses(){
    
  }
}
