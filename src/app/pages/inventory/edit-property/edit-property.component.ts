import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],
})
export class EditPropertyComponent implements OnInit {
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
  specFormGroup: any = this._formBuilder.group({});
  thirdFormGroup: any = this._formBuilder.group({});
  isEditable = false;
  toppings: any = this._formBuilder.group({});
  facilities: any = this._formBuilder.group({});
  checkin:any='';
  currentStep: any = 0;
  progressBarValue: number = 4;
  checkForCoverImage: imageValidation = {
    validationCheck: false,
    coverImage: [],
    featureImage: [],
  };
  addImages:any=[];
  addImageType:any = [];
  myRoomImageCheck:boolean = false;
  myRoomImageList:any = [];
  roomList:any=[];
  @Input()
  selectedIndex: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };
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
  myCoverImageCheck:boolean = false;
  coverImage:any;
  logo:any;
  constructor(
    private _formBuilder: FormBuilder,
    // private _productService: ProductService,
    public _dialog: MatDialog,
    private _route: Router,
    private _inventoryService: InventoryService
  ) {}

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
      address:[''],
      point_of_contact: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country:['', Validators.required],
      logo:['']
    });
    this.secondFormGroup = this._formBuilder.group({});

    this.specFormGroup = this._formBuilder.group({
      specLists: this.specRows,
    });
    this.toppings = this._formBuilder.group({
      flammable: false,
      liquid: false,
      battery: false,
      none: false,
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
    this.updateView();
    this.variantFormGroup.valueChanges.subscribe((val) => {
      this.composeVariantTable();
    });
    // this.thirdFormGroup.controls['shippingType'].valueChanges.subscribe(
    //   (value) => {
    //     this.shippingCategory = value;
    //   }
    // );
  }

  createProduct = () => {
    let specObj: any = this.specFormGroup.value.specLists;
    let variantObj = {
      variants: this.variantList.value,
      products: this.composedVariantList,
    };
    variantObj.variants = variantObj.variants.map((variant: any) => {
      let modifiedObj: any = {};
      modifiedObj.variant_name = variant.variantName;
      modifiedObj.variants = variant.variantTypes.map(
        (vt: any) => vt.variantItem
      );
      return modifiedObj;
    });
    let myTenantObj = JSON.parse(localStorage.getItem('tenant_details') || '');
  };

  saveProperty = () => {
    let property = {
      ...this.firstFormGroup.value,
      logo:this.logo,
    };
    this._inventoryService.addProperty(property)
    .subscribe((res:any) => {
      if(res && res.status === 1) {
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
  get specList() {
    return this.specFormGroup.get('specLists') as FormArray;
  }
  addSpecification() {
    this.specRows.push(
      this._formBuilder.group({
        specname: '',
        specval: '',
      })
    );
    this.updateView();
  }
  removeSpecification(i: number) {
    this.specRows.removeAt(i);
    this.updateView();
  }
  updateView() {
    this.specDataSource.next(this.specRows.controls);
  }
  get variantList() {
    return this.variantFormGroup.get('variantList') as FormArray;
  }

  addVariant() {
    this.variantArr.push([[{ name: '' }]]);
    this.variantList.push(
      this._formBuilder.group({
        variantName: '',
        variantTypes: this._formBuilder.array([
          this._formBuilder.group({
            variantItem: '',
          }),
        ]),
      })
    );
  }

  removeVariant(i: number) {
    this.variantArr.splice(i, 1);
    this.variantList.removeAt(i);
  }

  add(index: number) {
    let variantType: any = this.variantList.controls[index];
    if (this.variantArr[index]) {
      variantType.controls.variantTypes.push(
        this._formBuilder.group({
          variantItem: '',
        })
      );
    }
    variantType.controls.variantTypes.updateValueAndValidity();
  }

  remove(variant: any, index: number) {
    let variantType: any = this.variantList.controls[variant];
    variantType.controls.variantTypes.removeAt(index);
    variantType.controls.variantTypes.updateValueAndValidity();
  }
  getControls(index: number) {
    return this.variantList.controls[index].get('variantTypes') as FormArray;
  }
  composeVariantTable() {
    let productList = [];
    if (this.variantFormGroup.value.variantList.length != 0) {
      for (
        let i = 0;
        i < this.variantFormGroup.value.variantList[0].variantTypes.length;
        i++
      ) {
        if (this.variantFormGroup.value.variantList.length === 1) {
          let composedJSON: any = {
            quantity: 0,
            sale_price: 0,
            original_price: 0,
            availability: true,
          };
          composedJSON[this.variantFormGroup.value.variantList[0].variantName] =
            this.variantFormGroup.value.variantList[0].variantTypes[
              i
            ].variantItem;
          productList.push(composedJSON);
        } else {
          for (
            let j = 0;
            j < this.variantFormGroup.value.variantList[1].variantTypes.length;
            j++
          ) {
            let composedJSON: any = {
              quantity: 0,
              sale_price: 0,
              original_price: 0,
              availability: true,
            };
            composedJSON[
              this.variantFormGroup.value.variantList[0].variantName
            ] =
              this.variantFormGroup.value.variantList[0].variantTypes[
                i
              ].variantItem;
            composedJSON[
              this.variantFormGroup.value.variantList[1].variantName
            ] =
              this.variantFormGroup.value.variantList[1].variantTypes[
                j
              ].variantItem;
            productList.push(composedJSON);
          }
        }
      }
    }
    this.composedVariantList = productList;
    if (this.variantList.value.length >= 1) {
      let tempVar = [...this.variantList.value];
      // tempVar.shift();
      this.removeFirstVariant = tempVar;
    }
  }
  getShippingType(event: any) {}
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
  goToLink(routerLink:string){
    this._route.navigate([routerLink]);
  }
  coverFileChange(event:any){
    var reader = new FileReader();
    this.myCoverImageCheck = true;
    reader.onload = e => this.coverImage = reader.result;
    this.logo = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }
  addImageWithType(){
    this.addImages.push({type:'',files:[]});
  }
  addImagetoIndex(i:number,event:any,f:any){
    f.click();
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
}

interface imageValidation {
  validationCheck: boolean;
  coverImage: Array<any>;
  featureImage: Array<any>;
}
