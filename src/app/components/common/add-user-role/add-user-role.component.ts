import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { LoginService } from 'src/app/services/login/login.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})
export class AddUserRoleComponent implements OnInit {

  addUserGroup: any = this._formBuilder.group({});
  hotelDetails:any = [];

  constructor(private _formBuilder: FormBuilder, private _inventoryService: InventoryService,
    private _loginService: LoginService, private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.addUserGroup = this._formBuilder.group({
          username: ['', Validators.required],
          email: ['', Validators.required],
          password: ['', Validators.required],
          // hotelName: ['', Validators.required],
          hotelId: ['', Validators.required],
          available_features: ['', Validators.required]
    });
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
    this._loginService.savenewuserrole(this.addUserGroup.value).subscribe((res:any) => {
      let snackBarSuccess = this._snackBar.open('Hotel users created successfully', 'Close', {
        duration: 3000
      });
    })
  }

}
