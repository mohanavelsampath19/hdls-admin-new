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
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, V } from '@angular/cdk/keycodes';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],
})
export class EditPropertyComponent implements OnInit {

  facilityCtrl = new FormControl('');
  filteredFacility: Observable<string[]>;
  facilities: string[] = [];

  shippingCategory: string = 'free';
  variantFormGroup: FormGroup = this._formBuilder.group({
    variantList: this._formBuilder.array([]),
  });
  addOnBlur = true;
  variantArr: any[] = [];
  roomPrice: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  firstFormGroup: any = this._formBuilder.group({});
  secondFormGroup: any = this._formBuilder.group({});
  thirdFormGroup: any = this._formBuilder.group({});
  isEditable = false;
  // facilities: any = this._formBuilder.group({});
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
  roomFacilitiesList: string[] = ['Break Fast', 'Free Wifi', 'AC', 'Geyser', 'Power Backup', 'Elevator', '24 Hour Room Service'];
  // fruitInput:any = [];
  @ViewChild('fruitInput') fruitInput: any;
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
  propertyid: any;

  @ViewChild('myCoverImage', { static: false })
  myCoverImage!: ElementRef;
  checkoutError: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    // private _productService: ProductService,
    public _dialog: MatDialog,
    private _route: Router,
    private _inventoryService: InventoryService,
    private _activatedRoute: ActivatedRoute,
  ) {
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

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      property_name: ['', Validators.required],
      property_description: ['', Validators.required],
      property_type: ['', Validators.required],
      // availablerooms: [0, Validators.required],
      front_end_desk: ['', [Validators.required, Validators.maxLength(10)]],
      // points: ['', Validators.required],
      address: [''],
      point_of_contact: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      logo: [''],
      checkin: [''],
      checkout: [''],
      nearByLocation: this._formBuilder.array([])
    });
    this.secondFormGroup = this._formBuilder.group({});

    this._activatedRoute.params.subscribe((param: any) => {
      this._inventoryService.getPropertyDetail(param.id).subscribe((res: any) => {
        this.firstFormGroup.patchValue({
          property_name: res?.response?.hotelname,
          property_description: res?.response?.description,
          property_type: res?.response?.type,
          // availablerooms: [0, Validators.required],
          front_end_desk: res?.response?.frontdesknumber,
          // points: ['', Validators.required],
          address: res?.response?.address,
          point_of_contact: res?.response?.poc,
          city: res?.response?.city,
          state: res?.response?.state,
          country: res?.response?.country,
          logo: res?.response?.logo,
          checkin: res.response.checkin,
          checkout: res.response.checkout,
        });
        this.facilities = res && res.response && res.response.facilities ? res.response.facilities.split(",") : [];
        let myNearByList = JSON.parse(res.response.nearbyloc);
        for (let i = 0; i < myNearByList.length; i++) {
          let newFormItem = this.nearByForm();
          newFormItem.patchValue(myNearByList[i]);
          this.nearByLocation.push(newFormItem);
        }
        this.myCoverImageCheck = true;
        this.coverImage = environment.imageUrl + "/" + res.response.logo;
        this.propertyid = res?.response?.hotel_id;
        this.checkoutError = false;
      })
      // console.log(this.firstFormGroup.value, this.firstFormGroup.valid, '---')
    });

    this.firstFormGroup.controls['checkin'].valueChanges.subscribe(
      (value: any) => {
        this.isCheckinTimeValid();
      }
    );
    this.firstFormGroup.controls['checkout'].valueChanges.subscribe(
      (value: any) => {
        this.isCheckinTimeValid();
      }
    );
  }

  isCheckinTimeValid() {
    if (this.firstFormGroup.controls['checkin'].value === this.firstFormGroup.controls['checkout'].value) {
      this.checkoutError = true;
    } else {
      this.checkoutError = false
    }
  }

  saveProperty = () => {
    let property = {
      ...this.firstFormGroup.value,
      logo: this.logo,
      nearbyloc: JSON.stringify(this.nearByLocation.value),
      facilities: this.facilities
    };
    this._inventoryService.updateProperty(property, this.propertyid)
      .subscribe((res: any) => {
        if (res && res.status === 1) {
          const dialogRef = this._dialog.open(InfoPopupComponent, {
            data: {
              popupText: 'Property updated successfully',
            },
          });
          dialogRef.afterClosed().subscribe(() => {
            this._route.navigate(['/inventory'])
          });
        }
      })
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

  clearSelectedFile() {
    this.myCoverImage.nativeElement.value = '';
    this.myCoverImageCheck = false;
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
    console.log(this.facilities, '---facility---')
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
