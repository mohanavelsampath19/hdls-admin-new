import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewexpensesComponent } from 'src/app/components/common/viewexpenses/viewexpenses.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource:any;
  userSearch:any;
  displayedColumns:any = ['sno','name','mobile','email','address','city','state','dob','created_at','status','tier','view_expenses'];
  resultsLength:number=0;
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;
  selectedTier: string = 'all';
  UserListRes:any = [];
  constructor(private _reportService:ReportsService, private _dialog:MatDialog) { 
    this._reportService.getUserList().subscribe((userList:any)=>{
      this.UserListRes = userList.response;
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
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const search = filter.trim().toLowerCase();
      return data.firstname.toLowerCase().includes(search) || data.lastname.toLowerCase().includes(search)
            || data.customerid==search || data?.email?.toLowerCase().includes(search);
    };
  }
  pageChanged(event:any){
    console.log(event);

  }
  openExpenseDialog(userId:number) {
      const dialogRef = this._dialog.open(ViewexpensesComponent, {data:{user_id:userId}});
  }
  changeTier(tier:string) {
    this.selectedTier = tier;
    if (tier === 'all') {
      this.dataSource.data = this.UserListRes;
    }else{
      this.dataSource.data = this.UserListRes.filter((user:any) => user.pointsTier === this.selectedTier);
    }
  }

  filterStatus(status:string) {
    if (status === 'active') {
      this.dataSource.data = this.UserListRes.filter((user:any) => !user.inactive);
      return;
    }
      this.dataSource.data = this.UserListRes.filter((user:any) => user.inactive);
  }

  exportAsExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.dataSource?.data
        );
        const workbook: XLSX.WorkBook = {
          Sheets: { Coupons: worksheet },
          SheetNames: ['Coupons'],
        };
    
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
    
        const data: Blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        FileSaver.saveAs(
          data,
          'user_summary_report_' + new Date().getTime() + '.xlsx'
        );
  }
}
