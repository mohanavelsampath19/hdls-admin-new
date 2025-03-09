import { Component, EventEmitter, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PointsTableComponent } from '../points-table/points-table.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports/reports.service';

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
  displayedColumns: string[] = ['sno', 'desc', 'amount','date'];
  readonly dialogRef = inject(MatDialogRef<PointsTableComponent>);
  paymentFormGroup = new FormGroup({
    paymentDesc: new FormControl(),
    amount: new FormControl(),
    paymentDate:new FormControl()
  })
  closePopup = new EventEmitter();
  viewExpenseList:Array<any> = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _reportService:ReportsService) { 
    console.log(this.data);
  }

  ngOnInit(): void {
    this.refreshPaymentInfo();
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
    this._reportService.updateExternalPayment({...this.paymentFormGroup.value,user_id:this.data.user_id}).subscribe((paymentDesc:any)=>{
      console.log(paymentDesc);
      this.paymentFormGroup.reset();
      this.refreshPaymentInfo();
    })
  }
  clearExpenses(){
    this.paymentFormGroup.reset();
  }
  refreshPaymentInfo(){
    this._reportService.getExternalPaymentList(this.data.user_id).subscribe((paymentRes:any)=>{
      this.viewExpenseList = [...paymentRes.response];
    });
  }
}
