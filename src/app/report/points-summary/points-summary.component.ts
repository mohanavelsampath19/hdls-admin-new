import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-points-summary',
  templateUrl: './points-summary.component.html',
  styleUrls: ['./points-summary.component.scss']
})
export class PointsSummary implements OnInit {
  dataSource:any;
  userSearch:any;
  displayedColumns:any = ['sno','user_id', 'name','hotel', 'description','credit','debit'];
  resultsLength:number=0;
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;
  constructor(private _reportService:ReportsService) { 
    this._reportService.getPointsSummary().subscribe((userList:any)=>{
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  pageChanged(event:any){
    console.log(event);

  }
}
