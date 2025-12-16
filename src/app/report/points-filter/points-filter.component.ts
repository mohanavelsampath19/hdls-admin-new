import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/components/common/confirmation-modal/confirmation-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { FormControl, FormGroup } from '@angular/forms';
import { PointService } from 'src/app/services/points/point.service';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ReportsService } from 'src/app/services/reports/reports.service';


@Component({
  selector: 'app-points-filter',
  templateUrl: './points-filter.component.html',
  styleUrls: ['./points-filter.component.scss']
})
export class PointsFilterComponent implements OnInit {
   hotelGroup = new FormGroup({
      hotelid: new FormControl(''),
      from_date: new FormControl(''),
      to_date: new FormControl('')
    });
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
  hotelDetails:any = [];
  totalPointsList: any = [];
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'transaction_id',
    'membership_id',
    'member_name',
    'tier',
    'status',
    'points',
    'place',
    'source',
    'date',
    'time',
    'amount_paid',
    'points_worth',
    'points_expiry',
    'points_balance',
    'total_price'
  ];
  dataSource: any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;

  constructor(private _bookingService: BookingsService, private _dialog: MatDialog, 
    private _pointService: PointService,
    private _inventoryService: InventoryService,
    private _reportService: ReportsService
  ) {}

  ngOnInit(): void {
    this.getBookingHistory();
    this.getHotelList();
    this.getPointsSummary();
  }

  getHotelBookings() {
     const {hotelid, from_date, to_date} = this.hotelGroup.value;
      this._reportService.getPointsSummaryFiltered(hotelid, from_date, to_date).subscribe((res:any) => {
        console.log(res);
        this.totalPointsList = res.response;
        this.dataSource = new MatTableDataSource(res.response);
        this.dataSource.paginator = this.paginator;
      });
   }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
        if (value === 'earned') {
          this.dataSource.data = this.totalPointsList.filter((points:any) => points.credit > 0);
          return;
        } else if (value === 'redeemed') {
          this.dataSource.data = this.totalPointsList.filter((points:any) => points.credit === 0);
          return;
        }
    this.dataSource.data = [];
  };

  getHotelList() {
    const getCategory = 1;
      this._inventoryService.getInventoryList(getCategory).subscribe((res:any) => {
          this.hotelDetails = res.response.map((hotelData:any) => {
            return {
              hotel_id: hotelData.hotel_id,
              hotel_name: hotelData.hotelname
            }
          });
        },(error:any)=>{
          console.log(error);
        })
  }

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
    // this._pointService.getPointSummaryDetails().subscribe((res) => {
    //   console.log(res);
    // })
  }
  getPointsSummary() {
    
    this._reportService.getPointsSummary().subscribe((res:any) => {
      console.log(res);
      let userList = this.groupByUser(res.response);
      Object.values(userList).map((userObj:any,i:number)=>{
        console.log({
          userId: Object.keys(userList)[i],
          pointSum:userObj.reduce((point:any)=>{ return point.credit - point.debit; },0)
        })
        return {
          userId: Object.keys(userList)[i],
          pointSum:userObj.reduce((point:any)=>{ return point.credit - point.debit; },{})
        };
      });
      res.response.forEach((pointData:any) => {
        if(pointData.bookingDetails && pointData.bookingDetails.length > 0){
          pointData.place = pointData.bookingDetails[0]?.hotelmaster?.city;
          pointData.source = pointData.bookingDetails[0]?.hotelmaster?.hotelname;
          pointData.amount = pointData.bookingDetails[0]?.amount;
        }else{
          pointData.place =  pointData?.external_payment_master?.hotelmaster?.city;
          pointData.source =  pointData?.external_payment_master?.hotelmaster?.hotelname;
          pointData.amount = pointData?.external_payment_master?.amount;
        }
      });
      this.totalPointsList = res.response;
      this.dataSource = new MatTableDataSource(this.getFilteredPoints(res.response));
      this.dataSource.paginator = this.paginator;
    });
  }


  getFilteredPoints(point_data:any) {
    const filteredPoints:any = [];
    point_data.forEach((point_info:any) => {
      filteredPoints.push({
        transaction_id: point_info.transaction_id,
        membership_id: point_info.user_id,
        member_name: point_info.firstname + ' ' + point_info.lastname,
        tier: point_info.user.pointsTier,
        status: point_info.status,
        points: point_info.credit,
        place: point_info.place,
        source: point_info.source,
        amount_paid: point_info.amount,
        points_worth: point_info.amount * 0.05 || point_info.debit * 0.05,
        points_expiry: point_info.points_expiry,
        points_balance: point_info.points_balance,
        total_price: point_info.amount_paid + point_info.points_worth,
        credit: point_info.credit,
        debit: point_info.debit,
        created_at: new Date(point_info.created_at).toLocaleDateString(),
        time: new Date(point_info.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expiry_date: new Date(point_info.expiry_date).toLocaleDateString(),
      })
    });
    return filteredPoints

  }
  getHotelRelatedBookings(hotel_id:any, booking_data:any, userType:any) {
    if(userType) {
      return booking_data;
    }
    const getFilteredBookings = booking_data.filter((booking_info:any) => booking_info.hotelid === hotel_id);
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

  // changePage(e: any) {
  //   console.log(e);
  //   this.pageOffset = e.pageIndex === 0 ? 0 : e.pageIndex * e.pageSize;
  //   this.pageSize = e.pageSize;
  //   this.getBookingHistory();
  // }

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
        'store_summary_report_' + new Date().getTime() + '.xlsx'
      );
    }
    groupByUser(data:any){
      const groupedList = data.reduce((acc:any, obj:any) => {
        if (!acc[obj.user_id]) {
          acc[obj.user_id] = [];
        }
        acc[obj.user_id].push(obj);
        return acc;
      }, {});
      return groupedList;
    }
}