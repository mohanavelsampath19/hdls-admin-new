import { Component, EventEmitter, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-points-table',
  templateUrl: './points-table.component.html',
  styleUrls: ['./points-table.component.scss']
})
export class PointsTableComponent implements OnInit {
  closePopup = new EventEmitter();
  myDaysList:any = [];
  isCheckAddValid:boolean = true;
  readonly dialogRef = inject(MatDialogRef<PointsTableComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
) { }

  ngOnInit(): void {
    this.myDaysList = this.data.daysPercent;
  }
  addRow(){
    let dayLength;
    if(this.myDaysList.length>0){
      dayLength = this.myDaysList.length;
    }else{
      dayLength = 0;
    }
    this.myDaysList.push({
        day:dayLength+1,
        percent:100
      });
  }
  checkAddDayValid(){
    if(this.isCheckAddValid==false){
      this.isCheckAddValid = true;
    }
    for(let i=0;i<this.myDaysList.length;i++){
      if(!this.myDaysList[i].percent){
        this.isCheckAddValid = false;
      }
    }
  }
  closeModal(){
    this.dialogRef.close();
  }
  applyVoucherDays(){
    this.dialogRef.close({status:'added successfully', voucherDays:[...this.myDaysList]});
  }
  removeItem(i:number){
    this.myDaysList = [...this.myDaysList].filter((item:any,index:number)=>{
      return index!=i;
    }).map((item,i:number)=>{
      return {
        day: i+1,
        percent:item.percent
      }
    });
  }
}
