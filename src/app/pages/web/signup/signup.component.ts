import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  signupForm:FormGroup = new FormGroup({
    firstname:new FormControl('', Validators.required),
    lastname:new FormControl('', Validators.required),
    mobilenumber:new FormControl('', Validators.required),
    email:new FormControl(''),
    referenceCode:new FormControl('')
  });
  constructor(private _router:ActivatedRoute, private _routing:Router, private _loginService:LoginService,private _dialog: MatDialog) {
    this._router.queryParams.subscribe((queryParam:any)=>{
      this.signupForm.patchValue({referenceCode:queryParam.refid})
    });
   }

  ngOnInit(): void {
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
    this._loginService.signupUser({...this.signupForm.value}).subscribe((apiRes:any)=>{
      if(apiRes.status == 0){
        this._routing.navigate(['/success']);
      }else if(apiRes.status == 1){
        const dialogRef = this._dialog.open(InfoPopupComponent, {
          data: {
            popupText: `This user's credential already exist.`,
          },
        });
      }else{
        const dialogRef = this._dialog.open(InfoPopupComponent, {
          data: {
            popupText: `Issue with API. Please try again later.`,
          },
        });
      }
    });
    
  }
}
