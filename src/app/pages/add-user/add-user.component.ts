import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserRoleComponent } from 'src/app/components/common/add-user-role/add-user-role.component';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  dataSource:any;
    userSearch:any;
    displayedColumns:any = ['sno','name','mobile','address','city','state','dob','created_at'];
    resultsLength:number=0;
    @ViewChild(MatPaginator)
    paginator: MatPaginator | undefined;
    constructor(private _reportService:ReportsService, private _dialog: MatDialog, private _inventoryService: InventoryService) { 
      this._reportService.getUserList().subscribe((userList:any)=>{
        console.log(userList);
        this.dataSource = new MatTableDataSource( userList.response);
        this.dataSource.paginator = this.paginator;
        this.resultsLength = userList.response.length;
      })
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
        width: '600px'
      });
    }
}
