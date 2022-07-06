import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
//import { ProductService } from 'src/app/services/api/product/product.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoPopupComponent } from '../../../components/common/info-popup/info-popup.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, V } from '@angular/cdk/keycodes';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';


@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
})
export class AddPropertyComponent implements OnInit {
  shippingCategory: string = 'free';
  variantFormGroup: FormGroup = this._formBuilder.group({
    variantList: this._formBuilder.array([]),
  });
  addOnBlur = true;
  variantArr: any[] = [];
  roomPrice: any[] = [];
  @ViewChild('myCoverImage', { static: false })
  myCoverImage!: ElementRef;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  firstFormGroup: FormGroup = this._formBuilder.group({});
  secondFormGroup: any = this._formBuilder.group({});
  specFormGroup: any = this._formBuilder.group({});
  thirdFormGroup: any = this._formBuilder.group({});
  isEditable = false;
  facilities: any = this._formBuilder.group({});
  checkin: any = '';
  currentStep: any = 0;
  progressBarValue: number = 4;
  checkForCoverImage: imageValidation = {
    validationCheck: false,
    coverImage: [],
    featureImage: [],
  };
  addImages: any = [];
  addImageType: any = [];
  myRoomImageCheck: boolean = false;
  myRoomImageList: any = [];
  roomList: any = [];
  @Input()
  selectedIndex: any;

  warrantyPeriod = [
    {
      value: 0,
      name: 'No warranty',
    },
    {
      value: 1,
      name: '1 month',
    },
    {
      value: 2,
      name: '2 months',
    },
    {
      value: 3,
      name: '3 months',
    },
    {
      value: 4,
      name: '6 months',
    },
    {
      value: 5,
      name: '12 months',
    },
    {
      value: 6,
      name: '24 months',
    },
    {
      value: 7,
      name: '3 years',
    },
    {
      value: 8,
      name: '5 years',
    },
  ];
  warrantyType = [
    {
      name: 'Supplier warranty',
      value: 0,
    },
    {
      name: 'Manufacturer warranty',
      value: 1,
    },
    {
      name: 'International warranty',
      value: 2,
    },
    {
      name: 'No warranty',
      value: 3,
    },
  ];
  productType = [
    {
      name: 'New',
      value: 0,
    },
    {
      name: 'Refurbhished',
      value: 1,
    },
    {
      name: 'Exported',
      value: 2,
    },
    {
      name: 'Telco set',
      value: 3,
    },
  ];
  displayColumns = ['sno', 'specname', 'specval', 'delete'];
  adults: any = 0;
  childrens: any = 0;
  specDataSource = new BehaviorSubject<AbstractControl[]>([]);
  composedVariantList: Array<any> = [];
  removeFirstVariant: Array<any> = [];
  specRows: FormArray = this._formBuilder.array([]);
  myCoverImageCheck: boolean = false;
  coverImage: any;
  logo: any;
  latitude: any;
  longitude: any;
  appearance: any = {
    OUTLINE: "outline"
  }
  @ViewChild("placesRef") placesRef: GooglePlaceDirective | undefined;
  constructor(
    private _formBuilder: FormBuilder,
    // private _productService: ProductService,
    public _dialog: MatDialog,
    private _route: Router,
    private _inventoryService: InventoryService
  ) { }

  removevalue(i: any) {
    this.roomPrice.splice(i, 1);
  }

  addvalue() {
    this.roomPrice.push({ value: '' });
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      property_name: ['', Validators.required],
      property_description: ['', Validators.required],
      property_type: ['', Validators.required],
      // availablerooms: [0, Validators.required],
      front_end_desk: ['', Validators.required],
      // points: ['', Validators.required],
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      address: ['', Validators.required],
      point_of_contact: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      logo: [''],
      nearByLocation: this._formBuilder.array([])
    });
    this.secondFormGroup = this._formBuilder.group({});

    this.specFormGroup = this._formBuilder.group({
      specLists: this.specRows,
    });


    this.facilities = this._formBuilder.group({
      breakFast: false,
      ac: false,
      wifi: false,
      geyser: false,
      power_backup: false,
      elevator: false,
      room_service: false,
    });

    this.thirdFormGroup = this._formBuilder.group({
      packageWeight: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      length: ['', Validators.required],
      shippingType: 'free',
      shipping_charges: 0,
    });

    // this.thirdFormGroup.controls['shippingType'].valueChanges.subscribe(
    //   (value) => {
    //     this.shippingCategory = value;
    //   }
    // );
  }



  saveProperty = () => {
    console.log(this.firstFormGroup.value);
    if (this.firstFormGroup.value) {
      let { vicinity } = this.firstFormGroup.value.address;
      let property = {
        ...this.firstFormGroup.value,
        address: vicinity,
        logo: this.logo,
        nearbyloc: JSON.stringify(this.nearByLocation.value)
      };
      this._inventoryService.addProperty(property)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            const dialogRef = this._dialog.open(InfoPopupComponent, {
              data: {
                popupText: 'Property created successfully',
              },
            });
            dialogRef.afterClosed().subscribe(() => {
              this._route.navigate(['/inventory'])
            });
          }
        })
    }

  }

  getCurrentStep = (stepno: number) => {
    if (this.firstFormGroup.valid) {
      switch (stepno) {
        case 1:
          this.currentStep = stepno;
          this.progressBarValue = 20;
          break;
        case 2:
          this.currentStep = stepno;
          this.progressBarValue = 40;
          break;
        case 3:
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
  checkForFormImage(checkForStatus: imageValidation) {
    this.checkForCoverImage = checkForStatus;
    if (checkForStatus) {
      this.checkForCoverImage.validationCheck = true;
    } else {
      this.checkForCoverImage.validationCheck = false;
    }
  }




  getShippingType(event: any) { }
  addItem(category: any) {
    if (category === 'adults') {
      this.adults++;
    } else {
      this.childrens++;
    }
  }
  removeItem(category: any) {
    if (category === 'adults') {
      this.adults--;
    } else {
      this.childrens--;
    }
  }
  goToLink(routerLink: string) {
    this._route.navigate([routerLink]);
  }
  coverFileChange(event: any) {
    var reader = new FileReader();
    this.myCoverImageCheck = true;
    reader.onload = e => this.coverImage = reader.result;
    this.logo = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }


  onAutocompleteSelected(result: any) {
    console.log('onAutocompleteSelected: ', result);
    let country = this.getRegionName('country', result.address_components);
    let state = this.getRegionName("administrative_area_level_1", result.address_components);
    let city = this.getRegionName("locality", result.address_components);
    this.firstFormGroup.patchValue({ 'country': country, 'state': state, 'city': city });
  }

  onLocationSelected(location: any) {
    console.log('onLocationSelected: ', location);
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }


  getRegionName(locationType: string, addressComponent: any) {
    let region = addressComponent.filter((reg: any) => {
      if (reg.types.indexOf(locationType) > -1) {
        return reg;
      }
    });
    return region.length > 0 ? region[0].long_name : '';
  }
  registerOnTouched(event: any) {
    console.log(event);
  }
  addImageWithType() {
    this.addImages.push({ type: '', files: [] });
  }
  addImagetoIndex(i: number, event: any, f: any) {
    f.click();
  }
  roomImageFileChange(index: number, event: any) {
    let fileList = event.target.files;
    let modifiedList = this.pushToFileList(index, fileList);
    this.addImages[index].fileUpload = modifiedList[0].fileList;
    for (let i = 0; i < modifiedList.length; i++) {
      let reader = new FileReader();
      this.myRoomImageCheck = true;
      reader.onload = e => {
        if (this.addImages[index].fileList) {
          this.addImages[index].fileList.push(reader.result);
        }
        else {
          this.addImages[index].fileList = [];
          this.addImages[index].fileList.push(reader.result);
        }
      };
      reader.readAsDataURL(fileList[i]);
    }
    console.log(this.addImages[index]);
  }

  pushToFileList(index: number, fileList: any) {
    if (!this.roomList[index] || this.roomList[index].fileList.length == 0) {
      this.roomList[index] = { fileList: [] };
      this.roomList[index].fileList.push(fileList[0]);
    } else {
      for (let i = 0; i < fileList.length; i++) {
        let checkExist = this.roomList[index].fileList.filter((item: any) => item.name == fileList[i].name && item.size);
        if (checkExist.length == 0) {
          this.roomList[index].fileList.push(fileList[i]);
        }
      }
    }
    return this.roomList;
  }
  changeType(event: any) {
    console.log(event, this.nearByLocation);
  }
  changeLoc($event: any) {
    console.log($event);
  }
  get nearByLocation(): FormArray {
    return <FormArray>this.firstFormGroup.get('nearByLocation');
  }
  addNewLocation() {
    this.nearByLocation.push(this.nearByForm());
  }
  nearByForm() {
    return this._formBuilder.group({
      locType: [''],
      name: [''],
      distance: ['']
    });
  }
  handleAddressChange(e: any) {
    console.log(e);
  }
  removeImage(index:number){
    this.removeAt(this.addImages,index);
  }
  removeAt(ArrayList:any[],key:any){
    ArrayList.splice(key, 1);
  }
  clearSelectedFile(){
    this.myCoverImage.nativeElement.value = '';
    this.myCoverImageCheck = false;
  }
}

interface imageValidation {
  validationCheck: boolean;
  coverImage: Array<any>;
  featureImage: Array<any>;
}
