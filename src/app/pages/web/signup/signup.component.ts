import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isCouponCodeEntered:boolean = false;
  isValidCode:boolean = true;
  isValidated:boolean = false;
  referenceId:number = 0;
  signupForm:FormGroup = new FormGroup({
    firstname:new FormControl('', Validators.required),
    lastname:new FormControl('', Validators.required),
    mobilenumber:new FormControl('', Validators.required),
    email:new FormControl(''),
    referenceCode:new FormControl('')
  });
  isCouponCodeValid:boolean = false;
  constructor(private _router:ActivatedRoute, private _routing:Router, private _loginService:LoginService,private _dialog: MatDialog, private _snackbar: MatSnackBar,) {
    this._router.queryParams.subscribe((queryParam:any)=>{
      this.signupForm.patchValue({referenceCode:queryParam.refid})
    });
   }

  ngOnInit(): void {
    this.signupForm.get('referenceCode')?.valueChanges.subscribe(value => {
      
      const control = this.signupForm.get('referenceCode');
      
      if (value && value.trim() !== '') {
        this.isCouponCodeEntered = true;
        control?.setValidators([Validators.required]);
        this.isValidCode = false;
        this.isValidated = false;
      } else {
        // Clear validators if field is empty
        this.isCouponCodeEntered = false;
        control?.clearValidators();
        this.isValidCode = true;
      }
  
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }
  get first(): any {
    return this.signupForm.get('firstname');
  }
  get lastname():any{
    return this.signupForm.get('lastname');
  }
  get mobilenumber():any{
    return this.signupForm.get('mobilenumber');
  }
  get email():any{
    return this.signupForm.get('email');
  }
  get referenceCode():any{
    return this.signupForm.get('referenceCode');
  }
  submitForm(){
    console.log(this.signupForm.value);
    this._loginService.signupUser({...this.signupForm.value},this.referenceId).subscribe((apiRes:any)=>{
      if(apiRes.status == 0){
        this._routing.navigate(['/success']);
      }else if(apiRes.status == 1){
        const dialogRef = this._dialog.open(InfoPopupComponent, {
          data: {
            popupText: `This user's credential already exist.`,
          },
        });
      }else{
        console.log(apiRes);
        const dialogRef = this._dialog.open(InfoPopupComponent, {
          data: {
            popupText: `Issue with API. Please try again later.`,
          },
        });
      }
    });
    
  }
  validateCode(){
    this.isValidated = false;
    this._loginService.validateRefferenceCode(this.referenceCode.value).subscribe((apiRes:any)=>{
      this.isValidated = true;
      if(apiRes.status == 0){
        this.isValidCode = true;
        this.referenceId = apiRes.referenceId;
        this._snackbar.open('Reference Code is valid', 'dismiss');
      }else{
        this.isValidCode = false;
        this._snackbar.open('Invalid refferal code', 'dismiss');
      }
    });
  }
}
