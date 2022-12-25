import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {
  dataSource:any;
  userSearch:any;
  displayedColumns:any = ['sno','name','mobile','membershipname','amount','created_at','expires_at'];
  resultsLength:number=0;
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;
  constructor(private _reportService:ReportsService) { 
    this._reportService.getMembershipPurchase().subscribe((userList:any)=>{
      console.log(userList);
      userList.response.forEach((item:any) => {
        let d = new Date(item.created_at);
        d.setFullYear(d.getFullYear() + 1);
        item.expires_at = d;
      });
      this.dataSource = new MatTableDataSource( userList.response);
      this.dataSource.paginator = this.paginator;
      this.resultsLength = userList.response.length;
    })
  }

  ngOnInit(): void {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  pageChanged(event:any){
    console.log(event);

  }
}
