import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserRoleComponent } from 'src/app/components/common/add-user-role/add-user-role.component';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  dataSource:any;
    userSearch:any;
    displayedColumns:any = ['sno','name','email','available_features','hotel_id','edit'];
    resultsLength:number=0;
    @ViewChild(MatPaginator)
    paginator: MatPaginator | undefined;
    constructor(private _loginService:LoginService, private _dialog: MatDialog, private _inventoryService: InventoryService) { 
      this.refreshHotelUserList();
    }
  
    ngOnInit(): void {
      
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    pageChanged(event:any){
      console.log(event);
    }
    openAddUserModal(event:any) {
      event.preventDefault();
      this._dialog.open(AddUserRoleComponent, {
        height: '400px',
        width: '600px',
      }).afterClosed().subscribe(()=>{
        this.refreshHotelUserList();
      })
    }
    openEditUserModal(currentRow:any){
      this._dialog.open(AddUserRoleComponent, {
        height: '400px',
        width: '600px',
        data:{userDetails:currentRow}
      }).afterClosed().subscribe(()=>{
        this.refreshHotelUserList();
      })
    }
    openDeleteUserModal(currentRow:any){
      this._dialog.open(AddUserRoleComponent, {
        height: '100px',
        width: '400px',
        data:{userDetails:currentRow,deleteUserDetails:true}
      }).afterClosed().subscribe(()=>{
        this.refreshHotelUserList();
      })
    }
    

    refreshHotelUserList(){
      this._loginService.getHotelUserList().subscribe((userListRes:any)=>{
        let userList = userListRes.response.map((userObj:any)=>{
          if(userObj.available_features){
            userObj.permissions = JSON.parse(userObj.available_features);
          }else{
            userObj.permissions = [];
          }
          return userObj;
        })
        this.dataSource = new MatTableDataSource(userList);
        this.dataSource.paginator = this.paginator;
        this.resultsLength = userList.length;
      })
    }
}
