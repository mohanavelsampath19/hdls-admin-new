import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  dataSource:any;
  userSearch:any;
  displayedColumns:any = ['sno','name','mobile','membershipname','amount','created_at'];
  resultsLength:number=0;
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;
  constructor(private _reportService:ReportsService) { 
    this._reportService.getTransactionDetails().subscribe((userList:any)=>{
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
}
