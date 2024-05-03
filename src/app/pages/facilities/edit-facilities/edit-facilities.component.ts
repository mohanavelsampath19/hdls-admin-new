import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

@Component({
  selector: 'app-edit-facilities',
  templateUrl: './edit-facilities.component.html',
  styleUrls: ['./edit-facilities.component.scss']
})
export class EditFacilitiesComponent implements OnInit {

  editFacility:FormGroup = new FormGroup({
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
  facilityDetail:any;
  constructor(private _activatedRoute:ActivatedRoute,private _inventory:InventoryService, private _facilityService:FacilitiesService, private _route:Router, private _dialog:MatDialog) {
    this._inventory.getInventoryList().subscribe((inventoryList:any)=>{
      this.inventoryList = inventoryList.response;
    });
    this._activatedRoute.params.subscribe((param:any)=>{
      this._facilityService.getAllFacility(param.id).subscribe((membershipDetails:any)=>{
        this.facilityDetail = membershipDetails.response[0];
        this.editFacility.patchValue({
          facility_name: this.facilityDetail.facility_name,
          facility_type: this.facilityDetail.facility_type,
          description:this.facilityDetail.description,
          hotel_id: this.facilityDetail.hotel_id,
        });
        this.myCoverImageCheck = true;
        this.coverImage = this.facilityDetail.coverimage;
      })
    });
  }

  ngOnInit(): void {
  }
  saveFacility(){
    this._facilityService.updateFacility({...this.editFacility.value,logo:this.logo,facilityId:this.facilityDetail.id}).subscribe((facilityRes:any)=>{
      console.log(facilityRes);
      const dialogRef = this._dialog.open(InfoPopupComponent, {
        data: {
          popupText: 'Facility updated successfully',
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
