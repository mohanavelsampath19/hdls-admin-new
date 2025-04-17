import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { LoginService } from 'src/app/services/login/login.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})
export class AddUserRoleComponent implements OnInit {

  addUserGroup: FormGroup = this._formBuilder.group({});
  hotelDetails:any = [];
  isEditUserDetails:boolean = false;
  isDeleteUserDetails:boolean = false;
  userAlreadyExist:boolean = false;
  togglePassword:boolean = false;
  constructor(private _formBuilder: FormBuilder, private _inventoryService: InventoryService,
    private _loginService: LoginService, private _snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: any,  private _dialog:MatDialog
  ) { 
    
  }

  ngOnInit(): void {
    this.addUserGroup = this._formBuilder.group({
          username: ['', Validators.required],
          email: ['', Validators.required],
          password: ['', Validators.required],
          // hotelName: ['', Validators.required],
          hotelId: ['', Validators.required],
          available_features: ['', Validators.required]
    });
    if(this.data?.deleteUserDetails){
      this.isDeleteUserDetails = true;
      this.isEditUserDetails = false;
    }
    else if(this.data?.userDetails){
      this.isDeleteUserDetails = false;
      this.isEditUserDetails = true;
      let availableFeatures = JSON.parse(this.data.userDetails.available_features);
      this.addUserGroup.patchValue({
        username:this.data.userDetails.username,
        email:this.data.userDetails.email,
        password:this.data.userDetails.password,
        hotelId:availableFeatures.hotelId,
        available_features: availableFeatures.available_features
      });
//      this.addUserGroup.controls['available_features'].setValue(this.data.userDetails.available_features);
    }else{
      this.isEditUserDetails = false;
    }
    this.getHotelList();
  }

  ngDoCheck() {

  }

  getHotelList() {
    const getCategory = 1;
      this._inventoryService.getInventoryList(getCategory).subscribe((res:any) => {
          this.hotelDetails = res.response.map((hotelData:any) => {
            return {
              hotel_id: hotelData.hotel_id,
              hotel_name: hotelData.hotelname
            }
          });
          console.log(this.hotelDetails, '----')
        },(error:any)=>{
          console.log(error);
        })
  }

  saveUser() {
    if(this.isEditUserDetails){
      this._loginService.updateUserRole({...this.addUserGroup.value,id:this.data.userDetails.userid}).subscribe((res:any) => {
        let snackBarSuccess = this._snackBar.open('Hotel users updated successfully', 'Close', {
          duration: 3000
        })
        this._dialog.closeAll();
      })
    }else{
      this._loginService.savenewuserrole(this.addUserGroup.value).subscribe((res:any) => {
        let snackBarSuccess = this._snackBar.open('Hotel users created successfully', 'Close', {
          duration: 3000
        })
        this._dialog.closeAll();
      })
    }
  }
  deleteUser(){
    this._loginService.updateUserRole({...this.addUserGroup.value,id:this.data.userDetails.userid, isDeleted:true}).subscribe((res:any) => {
      let snackBarSuccess = this._snackBar.open('Hotel user deleted successfully', 'Close', {
        duration: 3000
      })
      this._dialog.closeAll();
    })
  }
  checkForAvailable(){
    this._loginService.getHotelUserList(this.addUserGroup.value.username).subscribe((userRes:any)=>{
      if(userRes.response.length>0){
        this.userAlreadyExist = true;
      }else{
        this.userAlreadyExist = false;
      }
    })
  }
  viewPassword(){
    this.togglePassword = !this.togglePassword;
  }
}
