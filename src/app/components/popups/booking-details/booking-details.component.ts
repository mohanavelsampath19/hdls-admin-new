import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ViewexpensesComponent } from 'src/app/components/common/viewexpenses/viewexpenses.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { ConfirmationModalComponent } from '../../common/confirmation-modal/confirmation-modal.component';
import { InfoPopupComponent } from '../../common/info-popup/info-popup.component';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
@Component({
  selector: 'app-booking-details-popup',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponentPopup implements OnInit {

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
      'actions'
    ];
    dataSource: any = new MatTableDataSource(this.totalMembershipList);
    pageSize: number = 5;
    pageOffset: number = 0;
    selectedHotel:number = 0;
    currentHotelList:any = [];
    constructor(private _reportService:ReportsService, private _bookingService: BookingsService, private _dialog: MatDialog, private _activatedRoute:ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any) { 
        console.log(this.data);    
    }
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
          
      
          this._bookingService.getBookingHistory(getCategory).subscribe((res:any) => {
            const isSuperUser = localStorage.getItem('logged-in-user') === 'hdlsadmin'? true : false;
            const loginResponseObj:any = JSON.parse(localStorage.getItem('loginRes') || '{}');
            if(isSuperUser){
                  let availableInventory = 0;
                  let getFilteredHoteBookings = this.getHotelRelatedBookings(availableInventory, res.response.bookingHistory, isSuperUser);
                  this.currentHotelList = getFilteredHoteBookings;
                  this.dataSource = new MatTableDataSource(getFilteredHoteBookings);
                  this.dataSource.paginator = this.paginator;
            }else{
              let availableInventory = JSON.parse(loginResponseObj.loginRes.available_features || {}).hotelId ?? 0;
              let getFilteredHoteBookings = this.getHotelRelatedBookings(availableInventory, res.response.bookingHistory, isSuperUser);
              this.currentHotelList = getFilteredHoteBookings;
              this.dataSource = new MatTableDataSource(getFilteredHoteBookings);
              this.dataSource.paginator = this.paginator;
            }
          })
        }
      
        getHotelRelatedBookings(hotel_id:any, booking_data:any, userType:any) {
          if(userType) {
            let getFilteredBookings = booking_data.map((bookingInfo:any) => {
              bookingInfo.totalWithTax = parseFloat(bookingInfo.amount) + bookingInfo.tax;
              return bookingInfo;
            }).filter((bookingInfo:any)=>{
                return bookingInfo.customerid == this.data.userId;
            });
            return getFilteredBookings;
          }else{
            let getFilteredBookings = booking_data.filter((booking_info:any) => booking_info.hotelid === hotel_id)
            .map((bookingInfo:any) => {
              bookingInfo.totalWithTax = parseFloat(bookingInfo.amount) + bookingInfo.tax;
              return bookingInfo;
            }).filter((bookingInfo:any)=>{
                if(this.selectedHotel && this.selectedHotel != 0){
                  return bookingInfo.hotelid === this.selectedHotel;
                }else{
                  return bookingInfo;
                }
              })
            return getFilteredBookings;
          }
          
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
      
        openBookingStatusChangePopup(event: Event, deleteid: any,bookingStatus:number,bookingInfo:any) {
          event.preventDefault();
          const dialogRef = this._dialog.open(ConfirmationModalComponent, {data:{bookingStatus:bookingStatus,bookingInfo:bookingInfo}});
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
