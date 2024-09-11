import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-room-schedule',
  templateUrl: './room-schedule.component.html',
  styleUrls: ['./room-schedule.component.scss']
})
export class RoomScheduleComponent implements OnInit {
  roomavailabilityForm:FormGroup = new FormGroup({
    from:new FormControl('',Validators.required),
    to:new FormControl('',Validators.required)
  });
  minToDate: Date | null = null;
  roomsId:number=0;
  isAvailable:boolean = true;
  scheduleId:number = 0;
  displayedColumns: string[] = ['sno', 'from', 'to', 'action'];
  dataSource:any;
  roomScheduleList:any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _roomService:RoomsService) { 
    this.roomsId = this.data.roomsid;
    console.log(data);
  }

  ngOnInit(): void {
    this.getRoomScheduleList();
  }
  onFromDateChange(){
    if(this.roomavailabilityForm.value.from){
      this.minToDate = new Date(this.roomavailabilityForm.value.from);
      this.minToDate.setDate(this.minToDate.getDate() + 1); // Set minimum date to one day after 'from' date
    }else{
      this.minToDate = null;
    }
  }
  changeAvailability(){
    this.isAvailable = !this.isAvailable;
  }
  saveScheduleDetails(){
    let reqPayload = {
      ...this.roomavailabilityForm.value,
      roomid:this.roomsId, existingId:this.scheduleId };
    this._roomService.updateRoomSchedule(reqPayload).subscribe((apiRes:any)=>{
      if(apiRes.status == 0){
        this.roomavailabilityForm.reset();
        this.getRoomScheduleList();
      }
      console.log(apiRes);
    },(error:any)=>{
      console.log(error);
    })
  }
  getRoomScheduleList(){
    this._roomService.getRoomScheduleList(this.data.roomsid).subscribe((apiRes:any)=>{
      console.log(apiRes);
      this.dataSource = new MatTableDataSource([...apiRes.response]);
      this.roomScheduleList = [...apiRes.response];
    })
  }
  editExistingSchedule(scheduleDetails:any){
    this.roomavailabilityForm.patchValue({
      from:scheduleDetails.from,
      to:scheduleDetails.to
    });
    this.scheduleId = scheduleDetails.id;
  }
}
