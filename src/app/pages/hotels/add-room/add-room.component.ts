import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { RoomsService } from '../../../services/rooms/rooms.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoPopupComponent } from '../../../components/common/info-popup/info-popup.component';
import { COMMA, ENTER, V } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit {
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
  constructor(
    private _formBuilder: FormBuilder,
    private _roomsService: RoomsService,
    public _dialog: MatDialog,
    private _route: Router,
    private _activatedRouter: ActivatedRoute
  ){}

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
    this.firstFormGroup = this._formBuilder.group({
      roomtitle: ['', Validators.required],
      roomsdesc: ['', Validators.required],
      bedtype: ['', Validators.required],
      totalrooms: ['', Validators.required],
      adults: [0, Validators.required],
      room_facilities: [''],
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
    // this.firstFormGroup.patchValue({
    //   roomtitle:'Super Deluxe',
    //   roomsdesc:'Super Deluxe',
    //   bedtype:'Single bedroom',
    //   totalrooms:'4',
    //   adults:4,
    //   room_facilities:[],
    //   roomsize:'10',
    //   points:400,
    //   price:1400
    // });
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
    let roomDetails = {
      hotelid: this.hotelId,
      ...this.firstFormGroup.value,
      addImages:this.addImages,
      coverImage: this.logo
    };

    this._roomsService.addRoomService(roomDetails).subscribe((res:any) => {
      console.log(res);
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
}

interface imageValidation {
  validationCheck: boolean;
  coverImage: Array<any>;
  featureImage: Array<any>;
}
