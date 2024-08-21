import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-points-table',
  templateUrl: './points-table.component.html',
  styleUrls: ['./points-table.component.scss']
})
export class PointsTableComponent implements OnInit {

  displayedColumns: string[] = [
    'guestSpend',
    'earnPoints',
    'reedemPoints',
    'amount',
    'percentageofDiscount'
  ];
  dataSource: any = new MatTableDataSource([]);
  pageSize: number = 5;
  pageOffset: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  changePage(e: any) {
    console.log(e);
    this.pageOffset = e.pageIndex === 0 ? 0 : e.pageIndex * e.pageSize;
    this.pageSize = e.pageSize;
  }

}
