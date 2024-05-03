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
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss']
})
export class AddRestaurantComponent implements OnInit {

  shippingCategory: string = 'free';
  variantFormGroup: FormGroup = this._formBuilder.group({
    variantList: this._formBuilder.array([]),
  });
  addOnBlur = true;
  variantArr: any[] = [];
  roomPrice: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  firstFormGroup: any = this._formBuilder.group({});
  isEditable = false;
  checkin:any='';
  currentStep: any = 0;
  progressBarValue: number = 4;
  checkForCoverImage: imageValidation = {
    validationCheck: false,
    coverImage: [],
    featureImage: [],
  };

  @Input()
  selectedIndex: any;

  displayColumns = ['sno', 'specname', 'specval', 'delete'];
  adults: any = 0;
  childrens: any = 0;
  specDataSource = new BehaviorSubject<AbstractControl[]>([]);
  composedVariantList: Array<any> = [];
  removeFirstVariant: Array<any> = [];
  specRows: FormArray = this._formBuilder.array([]);
  myCoverImageCheck:boolean = false;
  coverImage:any;
  myLogoImageCheck: boolean = false;
  logoImage: any;
  myHalalImageCheck: boolean = false;
  halalImage:any;
  restaurantImageCheck: boolean = false;
  restaurantImage: any;
  logo:any;
  constructor(
    private _formBuilder: FormBuilder,
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
      restaurant_name: ['', Validators.required],
      cuisine_type: ['', Validators.required],
      serving: ['', Validators.required],
      restaurant_description: ['', Validators.required],
      restaurant_slogan:[''],
      halal_nonhalal: ['', Validators.required],
      address:['', Validators.required],
      city:['', Validators.required],
      country:['', Validators.required],
      post_code:['', Validators.required],
      state:['', Validators.required],
      embedded_map:['', Validators.required],
      point_of_contact:['', Validators.required],
      point_of_contact2:['', Validators.required],
      email:['', Validators.required],
      restaurant_url_webiste:['', Validators.required],
      floor_capacity: ['', Validators.required],
      facility: ['', Validators.required],
    });
  }

  createProduct = () => {
   // console.log(this.firstFormGroup, '-----')
  };

  saveProperty = () => {
    let property = {
      ...this.firstFormGroup.value,
      logo:this.logo,
    };
    console.log(property);
    // this._inventoryService.addProperty(property)
    // .subscribe((res:any) => {
    //   if(res && res.status === 1) {
    //     const dialogRef = this._dialog.open(InfoPopupComponent, {
    //       data: {
    //         popupText: 'Property created successfully',
    //       },
    //     });
    //     dialogRef.afterClosed().subscribe(() => {
    //       this._route.navigate(['/inventory'])
    //     });
    //   }
    // })
  }


  checkForFormImage(checkForStatus: imageValidation) {
    this.checkForCoverImage = checkForStatus;
    if (checkForStatus) {
      this.checkForCoverImage.validationCheck = true;
    } else {
      this.checkForCoverImage.validationCheck = false;
    }
  }


  getShippingType(event: any) {}


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

  ngOnChanges() {
    console.log(this.firstFormGroup, '-----')
  }
}

interface imageValidation {
  validationCheck: boolean;
  coverImage: Array<any>;
  featureImage: Array<any>;
}
