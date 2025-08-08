import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SettlePopupComponent } from 'src/app/components/common/popups/settle-popup/settle-popup.component';
import { ViewexpensesComponent } from 'src/app/components/common/viewexpenses/viewexpenses.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss']
})
export class TransactionReportComponent {
  userSearch: string = '';
  selectedCategory: string = 'all';
  transactions = [
    {
      transactionId: 102,
      serviceCategory: 'Standard King',
      place: 'Ramada KL',
      membershipNumber: 56,
      memberName: 'Iskandar',
      date: '21-06-2025',
      time: '10.00 a.m',
      totalAmount: 351,
      memberPointsCharge: 16.00,
      pointsIssuanceCharge: 14.63,
      memberSpendCommission: 32.50,
      membershipPackageCommission: '-',
      status: 'Pending',
      settledDate: ''
    },
    {
      transactionId: 98,
      serviceCategory: 'Deluxe King',
      place: 'Ramada Langkawi',
      membershipNumber: 48,
      memberName: 'Bryan',
      date: '20-06-2025',
      time: '1.00 p.m',
      totalAmount: 324,
      memberPointsCharge: 15.00,
      pointsIssuanceCharge: 13.50,
      memberSpendCommission: 30.00,
      membershipPackageCommission: '-',
      status: 'Pending',
      settledDate: ''
    },
    {
      transactionId: 93,
      serviceCategory: 'Restaurant',
      place: 'Ramada KL',
      membershipNumber: 106,
      memberName: 'Joseph',
      date: '13-05-2025',
      time: '5.00 p.m',
      totalAmount: 129.60,
      memberPointsCharge: 5.40,
      pointsIssuanceCharge: 6.00,
      memberSpendCommission: '-',
      membershipPackageCommission: '-',
      status: 'Settled',
      settledDate: '06-06-2025'
    },
    {
      transactionId: 89,
      serviceCategory: 'Privilege in Sky package',
      place: 'Menara K188',
      membershipNumber: 29,
      memberName: 'William',
      date: '12-01-2024',
      time: '1.00 p.m',
      totalAmount: 311,
      memberPointsCharge: 13.00,
      pointsIssuanceCharge: '-',
      memberSpendCommission: '-',
      membershipPackageCommission: 43.20,
      status: 'Settled',
      settledDate: '31-01-2024'
    }
  ];

  displayedColumns = [
  'transactionId',
  'serviceCategory',
  'place',
  'membershipNumber',
  'memberName',
  'date',
  'time',
  'totalAmount',
  'memberPointsCharge',
  'pointsIssuanceCharge',
  'memberSpendCommission',
  'membershipPackageCommission',
  'status',
  'settledDate',
  'actions'
];
  dataSource:any;
    resultsLength:number=0;
    @ViewChild(MatPaginator)
    paginator: MatPaginator | undefined;
    selectedTier: string = 'all';
    UserListRes:any = [];
    isLoading: boolean = false;
    constructor(private _reportService:ReportsService, private _dialog:MatDialog,) { 
      
    }
  
    ngOnInit(): void {
      this.refreshTable();
    }

    exportAsExcel() {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource?.data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Coupons': worksheet },
        SheetNames: ['Coupons']
      };
    
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
    
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    
      FileSaver.saveAs(data, 'commission_report_' + new Date().getTime() + '.xlsx');
    }

    refreshTable() {
      this.isLoading = true;
      this._reportService.getTransactionDetails().subscribe((userList:any)=>{
        console.log(userList);
        this.isLoading = false;
        this.UserListRes = userList.response;
        this.dataSource = new MatTableDataSource( userList.response);
        this.dataSource.paginator = this.paginator;
        this.resultsLength = userList.response.length;
      })
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
    changeTier(tier:string) {
      this.selectedTier = tier;
      if (tier === 'all') {
        this.dataSource.data = this.UserListRes;
      }else{
        this.dataSource.data = this.UserListRes.filter((user:any) => user.pointsTier === this.selectedTier);
      }
    }
    openActionDialog(event: Event, bookingId: number, status: number) {
      event.preventDefault();
      const dialogRef = this._dialog.open(SettlePopupComponent, {
        width: '350px',
        data: { bookingId, status }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refreshTable();
        }
      });
}
}
