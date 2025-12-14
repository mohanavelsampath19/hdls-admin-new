import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/components/common/confirmation-modal/confirmation-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  getSearchValue: string = '';
  selectedCategory: string = 'all';
  userSearch: string = '';
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
    'tribe_reference_id',
    'booking_id',
    'customer_id',
    'customer_name',
    'mobile',
    'hotel',
    'room',
    'check_in',
    'check_out',
    'booking_date',
    'time',
    'total_amount',
    'special_requests',
    'status',
    'actions',
  ];
  dataSource: any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;
  selectedHotel: number = 0;
  currentHotelList: any = [];
  hotelGroup = new FormGroup({
    hotelid: new FormControl(''),
    from_date: new FormControl(''),
    to_date: new FormControl(''),
  });
  hotelDetails: any = [];
  currentFilter = '';

  constructor(
    private _bookingService: BookingsService,
    private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _inventoryService: InventoryService
  ) {

    this.dataSource.filterPredicate = (data:any, filter:any) => {
      const dataStr = data.customers.firstname + data.customers.lastname + data.customers.mobile + data.rooms.roomtitle + data.hotels.hotelname + data.bookingid + data.tribe_reference_id;
      return dataStr.indexOf(filter) != -1; 
    }

  }

  ngOnInit(): void {
    this.getBookingHistory();
    this.getHotelList();
    this.dataSource = new MatTableDataSource(this.skeletonList);
  }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getBookingHistory();
  };

  getHotelBookings() {
    const { hotelid, from_date, to_date } = this.hotelGroup.value;
    this.getFilteredMemberDetails({
      membershipid: hotelid,
      start_date: from_date,
      end_date: to_date,
    });
    this._bookingService.getHotelBookingHistory(hotelid, from_date, to_date).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(this.getTableData(res.response));
      this.dataSource.paginator = this.paginator;
    });
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

  getFilteredMemberDetails(member_data: any) {
    // this._reportService.getFilteredMembership(member_data).subscribe((res:any) => {
    //   this.dataSource = new MatTableDataSource(res.response);
    //   this.dataSource.paginator = this.paginator;
    // })
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

    this._bookingService
      .getBookingHistory(getCategory)
      .subscribe((res: any) => {
        const isSuperUser =
          localStorage.getItem('logged-in-user') === 'hdlsadmin' ? true : false;
        const loginResponseObj: any = JSON.parse(
          localStorage.getItem('loginRes') || '{}'
        );
        if (isSuperUser) {
          let availableInventory = 0;
          let getFilteredHoteBookings = this.getHotelRelatedBookings(
            availableInventory,
            res.response.bookingHistory,
            isSuperUser
          );
          this.currentHotelList = getFilteredHoteBookings;
          this.dataSource = new MatTableDataSource(this.getTableData(getFilteredHoteBookings));
          this.dataSource.paginator = this.paginator;
                console.log(this.getTableData(getFilteredHoteBookings))
        } else {
          let availableInventory =
            JSON.parse(loginResponseObj.loginRes.available_features || {})
              .hotelId ?? 0;
          let getFilteredHoteBookings = this.getHotelRelatedBookings(
            availableInventory,
            res.response.bookingHistory,
            isSuperUser
          );
          this.currentHotelList = getFilteredHoteBookings;
          this.dataSource = new MatTableDataSource(this.getTableData(getFilteredHoteBookings));
          this.dataSource.paginator = this.paginator;
          console.log(this.dataSource);
        }
        this._activatedRoute.queryParams.subscribe((params: any) => {
          this.selectedHotel = params.hotelid ?? 0;
          let bookingId = params.bookingid ?? 0;
          let customerId = params.customerid ?? 0;
          if (this.selectedHotel && this.selectedHotel != 0) {
            this.dataSource = new MatTableDataSource(
              this.getTableData(this.currentHotelList.filter(
                (item: any) => item.hotelid == this.selectedHotel
              ))
            );
            this.dataSource.paginator = this.paginator;
          } else {
            this.dataSource = new MatTableDataSource(this.getTableData(this.currentHotelList));
            this.dataSource.paginator = this.paginator;
          }
          if (bookingId && bookingId != 0) {
            this.dataSource = new MatTableDataSource(
              this.getTableData(this.currentHotelList.filter(
                (item: any) => item.bookingid == bookingId
              ))
            );
            this.dataSource.paginator = this.paginator;
          }
          if (customerId && customerId != 0) {
            this.dataSource = new MatTableDataSource(
              this.getTableData(this.currentHotelList.filter(
                (item: any) => item.customerid == customerId
              ))
            );
            this.dataSource.paginator = this.paginator;
          }
        });
      });
  }

  getHotelRelatedBookings(hotel_id: any, booking_data: any, userType: any) {
    if (userType) {
      return booking_data
        .map((bookingInfo: any) => {
          bookingInfo.totalWithTax =
            parseFloat(bookingInfo.amount) + bookingInfo.tax;
          return bookingInfo;
        })
        .filter((bookingInfo: any) => {
          if (this.selectedHotel && this.selectedHotel != 0) {
            return bookingInfo.hotelid === this.selectedHotel;
          } else {
            return bookingInfo;
          }
        });
    }
    const getFilteredBookings = booking_data
      .filter((booking_info: any) => booking_info.hotelid === hotel_id)
      .map((bookingInfo: any) => {
        bookingInfo.totalWithTax =
          parseFloat(bookingInfo.amount) + bookingInfo.tax;
        return bookingInfo;
      })
      .filter((bookingInfo: any) => {
        if (this.selectedHotel && this.selectedHotel != 0) {
          return bookingInfo.hotelid === this.selectedHotel;
        } else {
          return bookingInfo;
        }
      });
    return getFilteredBookings;
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  onFirstLoad() {
    this.dataSource = new MatTableDataSource(this.skeletonList);
    // this.dataSource.filterPredicate = (data: any, filter: string) => {
    //   const lowerCaseFilter = filter.trim().toLowerCase();

    //   // Function to recursively check all string properties of an object including nested ones
    //   const recursiveCheck = (obj: any): boolean => {
    //     for (const key in obj) {
    //       if (obj.hasOwnProperty(key)) {
    //         const value = obj[key];
    //         if (value != null) {
    //           if (typeof value === 'string' && value.toLowerCase().includes(lowerCaseFilter)) {
    //             return true;
    //           } else if (typeof value === 'object' && recursiveCheck(value)) {
    //             return true;
    //           }
    //         }
    //       }
    //     }
    //     return false;
    //   };

    //   return recursiveCheck(data);
    // };

    // this.dataSource.paginator = this.paginator;
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

  openBookingStatusChangePopup(event: Event, deleteid: any, bookingStatus: number, bookingInfo: any) {
    event.preventDefault();
    const dialogRef = this._dialog.open(ConfirmationModalComponent, {
      data: { bookingStatus: bookingStatus, bookingInfo: bookingInfo },
    });
    const getDialogRef = dialogRef.componentInstance.onDelete.subscribe(
      (data) => {
        this._dialog.closeAll();
        if (data.status) {
          let status =
            data.status === 'accepted'
              ? 1
              : data.status == 'rejected'
              ? 0
              : data.status == 'checked-in'
              ? 3
              : 4;
          this._bookingService
            .changeBookingStatus(deleteid, status, data.reason)
            .subscribe((res: any) => {
              if (res && res.status === 1) {
                const dialogRef = this._dialog.open(InfoPopupComponent, {
                  data: {
                    popupText: 'Booking status updated successfully',
                  },
                });
                this.getBookingHistory();
                dialogRef.afterClosed().subscribe(() => {});
              } else {
                const dialogRef = this._dialog.open(InfoPopupComponent, {
                  data: {
                    popupText: 'Please try again later',
                  },
                });
                dialogRef.afterClosed().subscribe(() => {});
              }
            });
        }
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      getDialogRef.unsubscribe();
    });
  }

  getSearchDetails = (event: Event) => {
    const value = (event.target as HTMLInputElement).value || '';
    this.currentFilter = value.trim().toLowerCase();
    this.dataSource.filter = this.currentFilter;
  };

  setSearchValue = (event: Event) => {
    event.preventDefault();
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  applyFilter(filterValue: string) {
      const testing = filterValue.trim().toLowerCase();
    this.dataSource.filter = testing;
  }

  getBookingBasedOnHotelId(event: any, hotelId: number) {
    event.preventDefault();
    this._bookingService.getHotelBookingHistory(hotelId).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(this.getTableData(res.response));
      this.dataSource.paginator = this.paginator;
    });
  }

  getTableData(tableData:any) {
    const formattedTableData:any = [];
    tableData.forEach((data:any) => {
      const formattedData = {
        bookingid: data.bookingid,
        customerid: data.customerid,
        customer_name: data.customers.firstname + ' ' + data.customers.lastname,
        mobile: data.customers.mobile,
        hotelname: data.hotelmaster.hotelname,
        roomtitle: data.rooms.roomtitle,
        created_at: new Date(data.created_at).toLocaleDateString(),
        updated_at: new Date(data.end_at).toLocaleDateString(),
        booking_date: new Date(data.booking_date).toLocaleDateString(),
        tax: parseFloat(data.amount) + data.tax,
        specialRequest: data.special_requests,
        status: this.getBookingStatus(data.status),
        time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      formattedTableData.push(formattedData);
    });

    return formattedTableData;
  }

    getBookingStatus(value: unknown) {
    let result = '';
    switch(value){
      case 0:
        result = 'Pending';
        break;
      case 1:
        result = 'Approved';
        break;
      case 2:
        result = 'Rejected';
        break;
      case 3:
        result = 'Cheked-In';
        break;
      case 4:
        result = 'Completed';
        break;
      case 4:
        result = 'Cancelled';
        break;
    }
    return result;
  }
}
