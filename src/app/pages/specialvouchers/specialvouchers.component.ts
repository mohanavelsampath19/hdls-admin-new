import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CouponGenerateComponent } from 'src/app/components/popups/coupon-generate/coupon-generate.component';
import { DeleteModalComponent } from 'src/app/components/common/delete-modal/delete-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { MemberShip, MembershipService } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-specialvouchers',
  templateUrl: './specialvouchers.component.html',
  styleUrls: ['./specialvouchers.component.scss']
})
export class SpecialvouchersComponent implements OnInit {

  selectedCategory: string = 'all';
  memberShipFilters: any = {
    categoryCounts: {
      live: '',
      in_active: '',
      draft: '',
      deleted: '',
    },
    membershipList: [],
  };
  totalMembershipList: Array<MemberShip> = [];
  skeletonList: Array<Loading> = [{ isLoading: true }, { isLoading: true }, { isLoading: true }, { isLoading: true },]
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'created_at',
    'voucher_code',
    'membership_list',
    'claimed_by'
  ];
  dataSource = new MatTableDataSource<MemberShip>([]);
  pageSize: number = 5;
  pageOffset: number = 0;
  loading: boolean = false;
  constructor(
    private _memberShipService: MembershipService,
    public _dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getTribeCouponList();
  }

  getSearchDetails = (event: Event) => {
    event.preventDefault();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  setSearchValue = (event: Event) => {
    event.preventDefault();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };


  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getTribeCouponList();
  };

  getSearchInput(searchValue: any) {
    let searchText = searchValue.toLowerCase();
    if (searchText === '') {
      this.dataSource = new MatTableDataSource(this.totalMembershipList);
    } else {
      let filteredResults;
      filteredResults = this.totalMembershipList.filter((list) => {
        let getValues = Object.values(list).toString().toLowerCase();
        return getValues.includes(searchText);
      });
      this.dataSource = new MatTableDataSource(filteredResults);
    }
  }

  getTribeCouponList() {
    this.loading = true;
    this._memberShipService.getTribeCouponList().subscribe((memberShipRes: any) => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(memberShipRes.response);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    })
  }
  createTribeCoupon() {
    const dialogRef = this._dialog.open(CouponGenerateComponent, {

    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.getTribeCouponList();
    });
  }
  changePage(e: any) {
    console.log(e);
    this.pageOffset = e.pageIndex === 0 ? 0 : e.pageIndex * e.pageSize;
    this.pageSize = e.pageSize;
  }
  ngAfterViewInit() {
    console.log(this.paginator);
  }
  exportAsExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
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
  
    FileSaver.saveAs(data, 'vouchers_export_' + new Date().getTime() + '.xlsx');
  }
}
