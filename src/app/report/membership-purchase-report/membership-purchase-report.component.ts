import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/components/common/confirmation-modal/confirmation-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-membership-purchase-report',
  templateUrl: './membership-purchase-report.component.html',
  styleUrls: ['./membership-purchase-report.component.scss'],
})
export class MembershipPurchaseReportComponent implements OnInit {
  getSearchValue: string = '';
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
  skeletonList: Array<Loading> = [
    { isLoading: true },
    { isLoading: true },
    { isLoading: true },
    { isLoading: true },
  ];
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort

  displayedColumns: string[] = [
    'transaction_id',
    'membership_number',
    'member_name',
    'tier',
    'membership_package_purchase',
    'membership_package_id',
    'place',
    'date',
    'time',
    'total_price',
    'points_issued',
    'status',
  ];
  dataSource: any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;
  memberId: number = 0;
  hotelDetails: any = [];
  hotelid: any = 0;

  hotelGroup = new FormGroup({
    hotelid: new FormControl(''),
    from_date: new FormControl(''),
    to_date: new FormControl(''),
  });

  constructor(
    private _bookingService: BookingsService,
    private _dialog: MatDialog,
    private route: ActivatedRoute,
    private _inventoryService: InventoryService
  ) {
    this.route.params.subscribe((param: any) => {
      this.memberId = param.id;
    });
  }

  ngOnInit(): void {
    this.getBookingHistory();
    this.getHotelList();
  }

  getHotelBookings() {
    const { hotelid, from_date, to_date } = this.hotelGroup.value;
    this.getHotelBookingHistory(hotelid, from_date, to_date);
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
      'membership_purchase_report_' + new Date().getTime() + '.xlsx'
    );
  }

  getHotelList() {
    const getCategory = 1;
    this._inventoryService.getInventoryList(getCategory).subscribe(
      (res: any) => {
        this.hotelDetails = res.response.map((hotelData: any) => {
          return {
            hotel_id: hotelData.hotel_id,
            hotel_name: hotelData.hotelname,
          };
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getHotelBookingHistory(hotelid: any, from_date: any, to_date: any) {
    this._bookingService
      .getHotelBookingHistory(hotelid, new Date(from_date), new Date(to_date))
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.response);
      });
  }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getBookingHistory();
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

  getBookingHistory() {
    //this.onFirstLoad();
    let getCategory = 1;
    this._bookingService.getBookingHistory(1).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.response.bookingHistory);
      this.dataSource.paginator = this.paginator;
    });
  }

  getHotelRelatedBookings(hotel_id: any, booking_data: any, userType: any) {
    if (userType) {
      return booking_data;
    }
    const getFilteredBookings = booking_data.filter(
      (booking_info: any) => booking_info.hotelid === hotel_id
    );
    return getFilteredBookings;
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  onFirstLoad() {
    this.dataSource = new MatTableDataSource(this.skeletonList);
    // this.dataSource.paginator = this.paginator;
  }

  updateImage() {
    this.dataSource = new MatTableDataSource(this.totalMembershipList);
  }

  changePage(e: any) {
    console.log(e);
    this.pageOffset = e.pageIndex === 0 ? 0 : e.pageIndex * e.pageSize;
    this.pageSize = e.pageSize;
    this.getBookingHistory();
  }

  getDateRange(daterange: any) {
    if (
      daterange.start === 'Invalid date' &&
      daterange.end === 'Invalid date'
    ) {
      // this.getProductList();
    } else if (daterange.start !== '' && daterange.end !== '') {
      // let myTenantObj = JSON.parse(
      //   localStorage.getItem('tenant_details') || ''
      // );
      // let tenant_id = myTenantObj.tenant_id;
      // this.tenantService
      //   .getProductsSearchByDate(daterange.start, daterange.end, tenant_id)
      //   .subscribe((res: any) => {
      //     if (res && res.status === 1) {
      //       this.totalProductList = res.products;
      //       this.dataSource = new MatTableDataSource(this.totalProductList);
      //     }
      //   });
    }
  }

  openDeleteDialog(event: Event, deleteid: any, bookingStatus: number) {
    event.preventDefault();
  }

  getSearchDetails = (event: Event) => {
    event.preventDefault();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  setSearchValue = (event: Event) => {
    event.preventDefault();
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  };
}
