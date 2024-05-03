import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MembershipService } from 'src/app/services/membership/membership.service';

@Component({
  selector: 'app-add-facilities',
  templateUrl: './add-facilities.component.html',
  styleUrls: ['./add-facilities.component.scss']
})
export class AddFacilitiesComponent implements OnInit {

  newFacility:FormGroup = new FormGroup({
    facility_name: new FormControl(),
    description: new FormControl(),
    hotel_id:new FormControl(),
    facility_type: new FormControl(),
    // stocks: new FormControl()
  });
  
  inventoryList:any;
  
  myCoverImageCheck:boolean = false;
  coverImage:any;
  logo:any;
  @ViewChild('myCoverImage', { static: false })
  myCoverImage!: ElementRef;
  
  constructor(private _inventory:InventoryService, private _facilityService:FacilitiesService, private _route:Router, private _dialog:MatDialog) { 
    this._inventory.getInventoryList().subscribe((inventoryList:any)=>{
      this.inventoryList = inventoryList.response;
    });
  }

  ngOnInit(): void {
  }
  saveFacility(){
    this._facilityService.addFacility({...this.newFacility.value,logo:this.logo}).subscribe((facilityRes:any)=>{
      console.log(facilityRes);
      const dialogRef = this._dialog.open(InfoPopupComponent, {
        data: {
          popupText: 'Facility created successfully',
        },
      });
      this._route.navigate(['/facilities']);
      dialogRef.afterClosed().subscribe(() => {
      });
    })
  }
  backToFacility(){
    this._route.navigate(['/facilities']);
  }
  coverFileChange(event:any){
    var reader = new FileReader();
    this.myCoverImageCheck = true;
    reader.onload = e => this.coverImage = reader.result;
    this.logo = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }
  clearSelectedFile(){
    this.myCoverImage.nativeElement.value = '';
    this.myCoverImageCheck = false;
  }
}
