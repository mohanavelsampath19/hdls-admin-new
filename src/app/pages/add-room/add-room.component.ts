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
//import { InfoPopupComponent } from '../../common/info-popup/info-popup.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, V } from '@angular/cdk/keycodes';

import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit {
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

  currentStep: any = 0;
  progressBarValue: number = 4;
  checkForCoverImage: imageValidation = {
    validationCheck: false,
    coverImage: [],
    featureImage: [],
  };

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
  constructor(
    private _formBuilder: FormBuilder,
    // private _productService: ProductService,
    public _dialog: MatDialog,
    private _route: Router
  ) {}

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
      room_name: ['', Validators.required],
      room_description: ['', Validators.required],
      bed_type: ['', Validators.required],
      room_quantity: ['', Validators.required],
      adults: [0, Validators.required],
      room_facilities: [''],
      room_size: ['', Validators.required],
      points: ['', Validators.required],
      restrictions: ['', Validators.required],
      room_price: ['', Validators.required],
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
    console.log(this.selectedIndex, 'index');
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
    console.log(
      this.firstFormGroup.value,
      this.thirdFormGroup.value,
      this.checkForCoverImage,
      specObj,
      variantObj
    );

    // this._productService
    //   .addProduct({
    //     ...this.firstFormGroup.value,
    //     ...this.thirdFormGroup.value,
    //     ...this.checkForCoverImage,
    //     ...this.toppings.value,
    //     specObj,
    //     variantObj,
    //     tenant_id: myTenantObj.tenant_id,
    //   })
    //   .subscribe(
    //     (productResponse: any) => {
    //       if (productResponse && productResponse.status === 0) {
    //         const dialogRef = this._dialog.open(InfoPopupComponent, {
    //           data: {
    //             popupText: 'Product created successfully',
    //           },
    //         });
    //         const getDialogRef =
    //           dialogRef.componentInstance.closePopup.subscribe(() => {
    //             this._dialog.closeAll();
    //             this.firstFormGroup.reset();
    //             this.secondFormGroup.reset();
    //             this.thirdFormGroup.reset();
    //             this.currentStep = 1;
    //             this.progressBarValue = 5;
    //             this._route.navigate(['/tenant/products']);
    //           });
    //         dialogRef.afterClosed().subscribe(() => {
    //           getDialogRef.unsubscribe();
    //         });
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  };

  draftProduct = () => {
    this.currentStep = 1;
    let myTenantObj = JSON.parse(localStorage.getItem('tenant_details') || '');
    // this._productService
    //   .draftProduct({
    //     ...this.firstFormGroup.value,
    //     ...this.thirdFormGroup.value,
    //     ...this.checkForCoverImage,
    //     ...this.toppings.value,
    //     tenant_id: myTenantObj.tenant_id,
    //   })
    //   .subscribe(
    //     (productResponse: any) => {
    //       if (productResponse && productResponse.status === 0) {
    //         const dialogRef = this._dialog.open(InfoPopupComponent, {
    //           data: {
    //             popupText: 'Product drafted successfully',
    //           },
    //         });
    //         const getDialogRef =
    //           dialogRef.componentInstance.closePopup.subscribe(() => {
    //             this._dialog.closeAll();
    //             this.firstFormGroup.reset();
    //             this.secondFormGroup.reset();
    //             this.thirdFormGroup.reset();
    //             this.currentStep = 1;
    //             this.progressBarValue = 5;
    //             this._route.navigate(['/tenant/products']);
    //           });
    //         dialogRef.afterClosed().subscribe(() => {
    //           getDialogRef.unsubscribe();
    //         });
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  };

  getCurrentStep = (stepno: number) => {
    console.log('check', stepno, this.firstFormGroup.valid);
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
  checkForFormImage(checkForStatus: imageValidation) {
    this.checkForCoverImage = checkForStatus;
    if (checkForStatus) {
      this.checkForCoverImage.validationCheck = true;
    } else {
      this.checkForCoverImage.validationCheck = false;
    }
  }
  // updateDiscount() {
  //   let original_price: any = this.firstFormGroup.value.original_price;
  //   let sale_price: any = this.firstFormGroup.value.sales_price;
  //   let differentPer =
  //     (parseInt(original_price) - parseInt(sale_price)) / (original_price / 100);
  //   this.firstFormGroup.controls.discount_percentage.setValue(differentPer);

  // }
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
}

interface imageValidation {
  validationCheck: boolean;
  coverImage: Array<any>;
  featureImage: Array<any>;
}
