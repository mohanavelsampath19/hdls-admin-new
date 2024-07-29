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
import { HotelsService } from 'src/app/services/hotels/hotels.service';
import { environment } from 'src/environments/environment';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss'],
})
export class EditRoomComponent implements OnInit {
  facilityCtrl = new FormControl('');
  filteredFacility: Observable<string[]>;
  facilities: string[] = [];
  addOnBlur = true;
  variantArr: any[] = [];
  priceArr: any[] = [];
  roomPrice: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  firstFormGroup: any = this._formBuilder.group({});
  isEditable = false;
  currentStep: any = 0;
  progressBarValue: number = 4;
  @ViewChild('myCoverImage', { static: false })
  myCoverImage!: ElementRef;
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
  roomid:any;
  roomFacilitiesList:string[] = ['Break Fast', 'Smoking Room', 'Extra Bed'];
  roomCategoryList:any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _roomsService: RoomsService,
    public _dialog: MatDialog,
    private _route: Router,
    private _activatedRouter: ActivatedRoute,
    private _hotelService: HotelsService
  ){
    this.filteredFacility = this.facilityCtrl.valueChanges.pipe(
      startWith(null),
      map((facility: string | null) => (facility ? this._filter(facility) : this.roomFacilitiesList.slice())),
    );
     this.firstFormGroup = this._formBuilder.group({
      roomtitle: ['', Validators.required],
      roomsdesc: ['', Validators.required],
      bedtype: ['', Validators.required],
      totalrooms: ['', Validators.required],
      room_facilities: [''],
      roomsize: ['', Validators.required],
      points: ['', Validators.required],
      price: ['', Validators.required],
      selling_price:['', Validators.required],
      numberofguest:['',Validators.required]
    });
  }

  removevalue(i: any) {
    this.roomPrice.splice(i, 1);
  }

  addvalue() {
    this.roomPrice.push({ value: '' });
  }

  ngOnChanges() {
    console.log(this.roomPrice, '---room price ---');
  }

  ngOnInit() {
    this._activatedRouter.queryParams.subscribe((res) => {
      if(res && res.id) {
        this.hotelId = res.id;
        this.roomid = res.roomid;
        this._hotelService.getRoomDetails(this.roomid).subscribe((res:any)=> {
          let images = JSON.parse(res.response.images);
          let title = res?.response?.roomtitle;
          let getCoverImage = res?.response?.cover_image;
           this.firstFormGroup.patchValue({
            roomtitle: res?.response?.roomtitle,
            roomsdesc:res?.response?.roomsdesc,
            bedtype:res?.response?.bedtype,
            totalrooms:res?.response?.totalrooms,
            adults:res?.response?.roomName,
            roomsize:res?.response?.roomsize,
            points:res?.response?.points,
            price:res?.response?.price,
            numberofguest: res?.response?.nog,
            selling_price: res?.response?.selling_price
          });
          this.facilities = res && res.response && res.response.room_facilities ? res.response.room_facilities.split(",") : []
          this.roomList = images[title]?.imageList || [];
          this.myCoverImageCheck = true;
          this.coverImage = `${environment.imageUrl}/${getCoverImage}`;
          this.roomCategoryList = Object.keys(images) || [];
          this.myRoomImageList = this.roomCategoryList.map((imageData:any,index:number) => {
            let setData = images[imageData].imageList ||[];
            let setImagePath = setData.map((updatePath:any) => {
              let trimPath = `${environment.imageUrl}/${updatePath.location}`.trim();
              return {
                'imagePath': trimPath,
                ...updatePath
              }
            })
            return {
              [imageData]: {
                "imageList": setImagePath
              }
            };
          })
          console.log(this.myRoomImageList);
        })
      }
    });

  }

  getCurrentStep = (stepno: number) => {
    if (this.firstFormGroup.valid) {
      switch (stepno) {
        case 1:
          this.currentStep = stepno;
          this.progressBarValue = 20;
          break;
        case 2:
          console.log(this.firstFormGroup);
          this.currentStep = stepno;
          this.progressBarValue = 40;
          break;
        case 3:
          console.log(this.firstFormGroup);
          this.currentStep = stepno;
          this.progressBarValue = 60;

          break;
        case 4:
          this.currentStep = stepno;
          this.progressBarValue = 80;
          break;
        case 5:
          this.currentStep = stepno;
          this.progressBarValue = 100;
          break;
        default:
          this.currentStep = 1;
          this.progressBarValue = 5;
      }
    }
  };

  saveRoom() {
    console.log(this.firstFormGroup.value, this.firstFormGroup);
    if(this.firstFormGroup.valid){
      let roomDetails = {
        hotelid: this.hotelId,
        ...this.firstFormGroup.value,
        addImages:this.addImages,
        coverImage: this.logo,
        room_facilities: this.facilities
      };

      this._roomsService.updateRoomService(roomDetails, this.roomid).subscribe((res:any) => {
       // console.log(res);
        if(res && res.status === 1) {
          const dialogRef = this._dialog.open(InfoPopupComponent, {
            data: {
              popupText: 'Room updated successfully',
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
    console.log(this.addImages[index]);
  }
  removeImage(index:number){
    this.removeAt(this.addImages,index);
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
    // this.fruitInput?.nativeElement.value = '';
    this.facilityCtrl.setValue(null);
   // console.log(this.facilities, '---facility---')
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.roomFacilitiesList.filter(facility => facility.toLowerCase().includes(filterValue));
  }

  removeRoomImage(categoryName:string, categoryIndex:number, index:number) {
    let getImageList = this.myRoomImageList[categoryIndex][categoryName].imageList ||[];
   // this.myRoomImageList[categoryIndex][categoryName].imageList = 
    let getFilterImage = getImageList.filter((details:any, indexNumber:number) => indexNumber !== index);
    this.myRoomImageList[categoryIndex][categoryName].imageList = getFilterImage;
  }

  updateRoomImage(categoryName:string, index:number, event:any) {
    var reader = new FileReader();
    reader.onload = e => {
      console.log(reader.result);
      this.myRoomImageList[index][categoryName].imageList.push({
        location: '',
        name: event.target.files[0].name,
        'imagePath': reader.result || ''
      });
      if(this.addImages[index]){
        this.addImages[index].fileUpload.push(event.target.files);
        this.addImages[index].fileList.push(reader.result);
        this.addImages[index].type = categoryName;
      } else {
      //  this.addImages = [];
        this.addImages.push({type: '', fileList: [], fileUpload: []});
        this.addImages[index].fileList.push(reader.result);
        this.addImages[index].fileUpload.push(event.target.files[0]);
        this.addImages[index].type = categoryName;
      }
    }
    reader.readAsDataURL(event.target.files[0]);

    console.log(categoryName, event.target.files, this.myRoomImageList[index][categoryName].imageList);   
  }

}

interface imageValidation {
  validationCheck: boolean;
  coverImage: Array<any>;
  featureImage: Array<any>;
}


