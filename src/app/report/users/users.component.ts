import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewexpensesComponent } from 'src/app/components/common/viewexpenses/viewexpenses.component';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource:any;
  userSearch:any;
  displayedColumns:any = ['sno','name','mobile','address','city','state','dob','created_at','view_expenses'];
  resultsLength:number=0;
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;
  constructor(private _reportService:ReportsService, private _dialog:MatDialog) { 
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
  openExpenseDialog(userId:number) {

      const dialogRef = this._dialog.open(ViewexpensesComponent, {data:{user_id:userId}});
  }
}
