import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { RoomsService } from '../../../services/rooms/rooms.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoPopupComponent } from '../../../components/common/info-popup/info-popup.component';
import { COMMA, ENTER, V } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute } from '@angular/router';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit {

  facilityCtrl = new FormControl('');
  filteredFacility: Observable<string[]>;
  facilities: string[] = [];
 // roomFacilitiesList: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  addOnBlur = true;
  variantArr: any[] = [];
  priceArr: any[] = [];
  roomPrice: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  firstFormGroup: any = this._formBuilder.group({});
  isEditable = false;
  currentStep: any = 0;
  progressBarValue: number = 4;
  checkForCoverImage: imageValidation = {
    validationCheck: false,
    coverImage: [],
    featureImage: [],
  };
  myRoomImageCheck:boolean = false;
  myRoomImageList:any = [];
  roomList:any=[];
  myCoverImageCheck:boolean = false;
  coverImage:any;
  logo:any;
  @Input()
  selectedIndex: any;

  displayColumns = ['sno', 'specname', 'specval', 'delete'];
  adults: any = 0;
  childrens: any = 0;
  hotelId:number=0;
  addImages:any=[];
  addImageType:any = [];
  roomFacilitiesList:string[] = ['Break Fast', 'Smoking Room', 'Extra Bed'];
  updatedImageList:any=[];
 // fruitInput:any = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  constructor(
    private _formBuilder: FormBuilder,
    private _roomsService: RoomsService,
    public _dialog: MatDialog,
    private _route: Router,
    private _activatedRouter: ActivatedRoute
  ){
    this.filteredFacility = this.facilityCtrl.valueChanges.pipe(
      startWith(null),
      map((facility: string | null) => (facility ? this._filter(facility) : this.roomFacilitiesList.slice())),
    );
  }

  removevalue(i: any) {
    this.roomPrice.splice(i, 1);
  }

  addvalue() {
    this.roomPrice.push({ value: '' });
  }

  ngOnChanges() {
    console.log(this.roomPrice, '---room price ---', this.coverImage);
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      roomtitle: ['', Validators.required],
      roomsdesc: ['', Validators.required],
      bedtype: ['', Validators.required],
      totalrooms: ['', Validators.required],
      roomsize: ['', Validators.required],
      points: ['', Validators.required],
      price: ['', Validators.required],
      selling_price: ['', Validators.required],
      numberofguest:['',Validators.required]
    });

    this._activatedRouter.queryParams.subscribe((res) => {
      if(res && res.id) {
        this.hotelId = res.id;
      }
    });
  }

  async saveRoom() {
    if(this.firstFormGroup.valid){
      let allPromises:any = [];
      this.addImages.forEach((imageDetails:any) => {
        imageDetails['fileUpload'].forEach((fileDetails:any) => {
          let updatePromise = new Promise((resolve, reject) => {
          this._roomsService.uploadImages(fileDetails, imageDetails.type).subscribe((res: any) => {
            if (res && res.status === 1) {
              if(this.updatedImageList[imageDetails.type]) {
                this.updatedImageList[imageDetails.type].imageList.push({
                  name: fileDetails.name,
                  location: res.response
                });
              } else {
                this.updatedImageList = {
                  ...this.updatedImageList,
                  [imageDetails.type] : {
                    imageList: []
                  }
                }
                this.updatedImageList[imageDetails.type].imageList.push({
                  name: fileDetails.name,
                  location: res.response
                });
              }
              resolve(this.updatedImageList);
            } else {
              reject();
            }
          })
        }); 
          allPromises.push(updatePromise)
        })
      })
      Promise.all(allPromises).then((values) => {
        this.saveDetails();
      })
    }
  }

  saveDetails() {
    let roomDetails = {
      hotelid: this.hotelId,
      ...this.firstFormGroup.value,
      addImages:this.addImages,
      coverImage: this.logo,
      room_facilities: this.facilities,
      updatedRoomImages: JSON.stringify(this.updatedImageList)
    };

    this._roomsService.addRoomService(roomDetails).subscribe((res:any) => {
      if(res && res.status === 1) {
        const dialogRef = this._dialog.open(InfoPopupComponent, {
          data: {
            popupText: 'Room created successfully',
          },
        });
        this._route.navigate(['/hotels'], { queryParams: { id: this.hotelId } });
        dialogRef.afterClosed().subscribe(() => {
        });
      } else {
        const dialogRef = this._dialog.open(InfoPopupComponent, {
          data: {
            popupText: 'Please try again later',
          },
        });
        dialogRef.afterClosed().subscribe(() => {
        });
      }
    })
  }
  checkForFormImage(checkForStatus: imageValidation) {
    this.checkForCoverImage = checkForStatus;
    if (checkForStatus) {
      this.checkForCoverImage.validationCheck = true;
    } else {
      this.checkForCoverImage.validationCheck = false;
    }
  }

  addItem(category: any) {
    if (category === 'adults') {
      this.adults++;
    } else {
      this.childrens++;
    }
  }
  removeItem(category: any) {
    if (category === 'adults' && this.adults!=0) {
      this.adults--;
    } else {
      if(this.childrens!=0){
        this.childrens--;
      }
    }
  }
  goToLink(routerLink:string){
    this._route.navigate([routerLink]);
  }
  roomImageFileChange(index:number,event:any){
    let fileList = event.target.files;
    let modifiedList = this.pushToFileList(index,fileList);
    this.addImages[index].fileUpload = modifiedList[0].fileList;
    for(let i=0;i<modifiedList.length;i++){
      let reader = new FileReader();
      this.myRoomImageCheck = true;
      reader.onload = e => {
        if(this.addImages[index].fileList){
          this.addImages[index].fileList.push(reader.result);
        }
        else{
          this.addImages[index].fileList = [];
          this.addImages[index].fileList.push(reader.result);
        }
      };
      reader.readAsDataURL(fileList[i]);
    }
    console.log(this.addImages[index], this.myRoomImageCheck);
  }
  removeImage(index:number){
    this.removeAt(this.addImages,index);
    if(this.addImages.length === 0) { this.myRoomImageCheck = false }
    console.log(this.addImages[index], this.myRoomImageCheck);
  }
  removeAt(ArrayList:any[],key:any){
    ArrayList.splice(key, 1);
  }
  addImageWithType(){
    this.addImages.push({type:'',files:[]});
  }
  updateRoomImageFiles(index:any,event:any){
    console.log(this.addImages[index]);
  }
  pushToFileList(index:number,fileList:any){
    if(!this.roomList[index] || this.roomList[index].fileList.length==0){
      this.roomList[index] = {fileList:[]};
      this.roomList[index].fileList.push(fileList[0]);
    }else{
      for(let i=0;i<fileList.length;i++){
        let checkExist = this.roomList[index].fileList.filter((item:any)=>item.name==fileList[i].name && item.size);
        if(checkExist.length==0){
          this.roomList[index].fileList.push(fileList[i]);
        }
      }
    }
    return this.roomList;
  }
  addImagetoIndex(i:number,event:any,f:any){
    f.click();
  }

  coverFileChange(event:any){
    console.log(this.firstFormGroup.valid, this.firstFormGroup.value)
    var reader = new FileReader();
    this.myCoverImageCheck = true;
    reader.onload = e => this.coverImage = reader.result;
    this.logo = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.facilities.push(value);
    }
    event.chipInput!.clear();
    this.facilityCtrl.setValue(null);
  }

  remove(facility: string): void {
    const index = this.facilities.indexOf(facility);

    if (index >= 0) {
      this.facilities.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.facilities.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.facilityCtrl.setValue(null);
  //  console.log(this.facilities, '---facility---')
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.roomFacilitiesList.filter(facility => facility.toLowerCase().includes(filterValue));
  }
}

interface imageValidation {
  validationCheck: boolean;
  coverImage: Array<any>;
  featureImage: Array<any>;
}
