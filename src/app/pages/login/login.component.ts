import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subscription, timer } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100),
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  showHints = false;
  uppercase = false;
  lowercase = false;
  numeric = false;
  length = false;
  hide = true;
  showMessage = false;
  status = '';
  message = '';
  password = '';
  form!: FormGroup;
  enterPhoneNumberForm!: FormGroup;
  enterOTPForm!: FormGroup;
  createNewPwdform!: FormGroup;
  loading = false;
  showLogin = true;
  showResetPassword = false;
  showEnterOTP = false;
  otp_phonenumber = '';
  showCreateNewPassword = false;
  disableResendBtn = true;
  countDown?: Subscription;
  counter = 300;
  // counter = 120;
  tick = 1000;
  screenInnerHeight: number = (window.innerWidth * 90) / 100;

  images = [
    {
      path: '../../../assets/logo.jpg',
    },
    {
      path: '../../../assets/logo.jpg',
    },
    {
      path: '../../../assets/logo.jpg',
    },
  ];

  constructor(
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _loginService:LoginService
  ) {}

  checkLogin(e:any){
    e.preventDefault();
    this.login();
  }
  login() {
    if (this.form.valid) {
      this.loading = true;
      this.showMessage = false;
      // this._router.navigate(['/Landingpage']);
      this._loginService
        .login(
          this.form.get('username')?.value,
          this.form.get('password')?.value
        )
        .subscribe(
          (loginResponse: any) => {
            this.showMessage = true;
            if (loginResponse.status === 0) {
              this.loading = false;
              // this.openMessage('Login successful', 'Success');
              localStorage.setItem('logged-in-user',this.form.value.username);
              localStorage.setItem('loginRes',JSON.stringify(loginResponse));
              this._router.navigate(['']);
            } else {
              this.loading = false;
              this.openMessage('Login unsuccessful', loginResponse.message);
            }
          },
          (error) => {
            console.log(error);
            this.showMessage = true;
            this.loading = false;
            this.openMessage('Login unsuccessful', 'error');
          }
        );
    }
  }

  openSignup(e: Event) {
    e.preventDefault();
    this._dialog.closeAll();

    // let _dialogRef;
    // // = this._dialog.open(RegisterComponent, {
    // //   width: '70%',
    // // });
    // if (window.innerWidth > 1366) {
    //   _dialogRef = this._dialog.open(RegisterComponent, {
    //     width: '70%',
    //   });
    // } else {
    //   _dialogRef = this._dialog.open(RegisterComponent, {
    //     width: '80vw',
    //   });
    // }
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.enterPhoneNumberForm = this._formBuilder.group({
      forgotPhoneNumber: new FormControl('', [Validators.required]),
    });
    this.enterOTPForm = this._formBuilder.group({
      otp: new FormControl('', [Validators.required]),
    });
    this.createNewPwdform = this._formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  openMessage(message: string, status: string) {
    this.message = message;
    this.status = status;
  }

  closeErrorMsg() {
    this.showMessage = false;
  }

  forgotPassword() {
    this.showLogin = false;
    this.showResetPassword = true;
  }

  sendOTP() {
    if (this.enterPhoneNumberForm.valid) {
      // this._userService
      //   .generateOTP(
      //     this.enterPhoneNumberForm.get('forgotPhoneNumber')?.value,
      //     'user'
      //   )
      //   .subscribe(
      //     (loginResponse: any) => {
      //       this.showMessage = true;
      //       if (loginResponse.status === 1) {
      //         this.otp_phonenumber =
      //           this.enterPhoneNumberForm.get('forgotPhoneNumber')?.value;
      //         this.showResetPassword = false;
      //         this.showEnterOTP = true;
      //         this.countDown = timer(0, this.tick).subscribe(() => {
      //           if (this.counter > 0) {
      //             --this.counter;
      //           } else {
      //             this.disableResendBtn = false;
      //           }
      //         });
      //       } else {
      //         this.loading = false;
      //         this.showMessage = true;
      //         this.openMessage(loginResponse.message, 'error');
      //       }
      //     },
      //     (error) => {
      //       console.log(error);
      //       this.showMessage = true;
      //       this.loading = false;
      //       this.openMessage("Couldn't send OTP", 'error');
      //     }
      //   );
    }
  }
  editPhoneNumber() {
    this.showResetPassword = true;
    this.showEnterOTP = false;
  }
  resendOTP() {
    if (this.enterPhoneNumberForm.valid) {
      // this._userService
      //   .generateOTP(
      //     this.enterPhoneNumberForm.get('forgotPhoneNumber')?.value,
      //     'user'
      //   )
      //   .subscribe(
      //     (loginResponse: any) => {
      //       this.showMessage = true;
      //       if (loginResponse.status === 0) {
      //         this.otp_phonenumber =
      //           this.enterPhoneNumberForm.get('forgotPhoneNumber')?.value;
      //         this.disableResendBtn = true;
      //         this.counter = 300;
      //         this.showResetPassword = false;
      //         this.showEnterOTP = true;
      //         this.countDown = timer(0, this.tick).subscribe(() => {
      //           if (this.counter > 0) {
      //             --this.counter;
      //           } else {
      //             this.disableResendBtn = false;
      //           }
      //         });
      //       } else {
      //         this.loading = false;
      //         this.openMessage("Couldn't send OTP", loginResponse.message);
      //       }
      //     },
      //     (error) => {
      //       console.log(error);
      //       this.showMessage = true;
      //       this.loading = false;
      //       this.openMessage("Couldn't send OTP", 'error');
      //     }
      //   );
    }
  }

  verifyOTP() {
    if (this.enterOTPForm.valid) {
      // this._userService
      //   .verifyOTP(
      //     this.enterPhoneNumberForm.get('forgotPhoneNumber')?.value,
      //     this.enterOTPForm.get('otp')?.value
      //   )
      //   .subscribe(
      //     (loginResponse: any) => {
      //       this.showMessage = true;
      //       if (loginResponse.status === 1) {
      //         this.showEnterOTP = false;
      //         this.showCreateNewPassword = true;
      //       } else {
      //         this.loading = false;
      //         this.showMessage = true;
      //         this.openMessage(loginResponse.message, 'error');
      //       }
      //     },
      //     (error) => {
      //       console.log(error);
      //       this.showMessage = true;
      //       this.loading = false;
      //       this.openMessage("Couldn't verify OTP", 'error');
      //     }
      //   );
    }
  }

  createNewPwd() {
    if (this.createNewPwdform.valid) {
      // this._userService
      //   .updatePassword(
      //     this.enterPhoneNumberForm.get('forgotPhoneNumber')?.value,
      //     btoa(this.createNewPwdform.get('password')?.value),
      //     'user'
      //   )
      //   .subscribe(
      //     (loginResponse: any) => {
      //       this.showMessage = true;
      //       if (loginResponse.status === 1) {
      //         this.showLogin = true;
      //         this.showCreateNewPassword = false;
      //         this.openMessage(loginResponse.message, 'success');
      //       } else {
      //         this.loading = false;
      //         this.openMessage(loginResponse.message, 'error');
      //       }
      //     },
      //     (error) => {
      //       console.log(error);
      //       this.showMessage = true;
      //       this.loading = false;
      //       this.openMessage('Cannot update password', 'error');
      //     }
      //   );
    }
  }

  onPasswordEnter(event: any) {
    const password = event.target.value;
    this.showHints = true;
    this.password = password;
    if (/\d/.test(password)) {
      this.numeric = true;
    } else {
      this.numeric = false;
    }

    if (/(?=[^a-z]*[a-z])/.test(password)) {
      this.lowercase = true;
    } else {
      this.lowercase = false;
    }

    if (/(?=[^A-Z]*[A-Z])/.test(password)) {
      this.uppercase = true;
    } else {
      this.uppercase = false;
    }
    if (/.{8,30}/.test(password)) {
      this.length = true;
    } else {
      this.length = false;
    }
  }
}
