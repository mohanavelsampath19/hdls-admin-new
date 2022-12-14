import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/components/common/confirmation-modal/confirmation-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  getSearchValue:string = '';
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

  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'property_name',
    'property_id',
    'room_type',
    'customername',
    'amount',
    'hotel_confirmation_number',
    'remarks',
    'status',
    'action',
  ];
  dataSource: any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;

  constructor(private _bookingService: BookingsService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this.getBookingHistory();
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
    this.onFirstLoad();
    let getCategory = 1;
    switch (this.selectedCategory) {
      case 'live':
        getCategory = 1;
        break;
      case 'rejected':
        getCategory = 2;
        break;
      case 'all':
        getCategory = 3;
        break;
      case 'cancelled':
        getCategory = 4;
        break;
      default:
        getCategory = 3;
        break;
    }

    this._bookingService.getBookingHistory(getCategory).subscribe((res:any) => {
      this.dataSource = new MatTableDataSource(res.response.bookingHistory);
       this.dataSource.paginator = this.paginator;
    })
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

  openDeleteDialog(event: Event, deleteid: any,bookingStatus:number) {
    event.preventDefault();
    const dialogRef = this._dialog.open(ConfirmationModalComponent, {data:{bookingStatus:bookingStatus}});
    const getDialogRef = dialogRef.componentInstance.onDelete.subscribe(
      (data) => {
        this._dialog.closeAll();
        if (data.status) {
          let status = (data.status === 'accepted') ? 1 : data.status =='rejected'? 0: 4;
          this._bookingService.changeBookingStatus(deleteid, status, data.reason).subscribe((res:any)=> {
            if(res && res.status === 1) {
              const dialogRef = this._dialog.open(InfoPopupComponent, {
                data: {
                  popupText: 'Booking status updated successfully',
                },
              });
              this.getBookingHistory();
              dialogRef.afterClosed().subscribe(() => {
              });
            } else {
              const dialogRef = this._dialog.open(InfoPopupComponent, {
                data: {
                  popupText: 'Please try again later',
                },
              });
              dialogRef.afterClosed().subscribe(() => {
              });
            }
          })
        }
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      getDialogRef.unsubscribe();
    });
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
