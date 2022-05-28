import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { HotelsService, HotelDetails } from '../../services/hotels/hotels.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

  selectedCategory: string = 'all';
  memberShipFilters: any = {
    categoryCounts: {
      live: '',
      in_active: '',
      draft: '',
      deleted: '',
    },
    hotelsList: [],
  };
  totalHotelsList: Array<HotelDetails> = [];
  skeletonList: Array<Loading> = [{isLoading:true},{isLoading:true},{isLoading:true},{isLoading:true},]
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'name',
    'type',
    'price',
    'quantity',
    'status',
    'action'
  ];
  dataSource:any = new MatTableDataSource(this.totalHotelsList);
  pageSize: number = 5;
  pageOffset: number = 0;
  hotelId:number=0;
  constructor(private _hotelService:HotelsService, private _activatedRouter: ActivatedRoute, private _route: Router, private _roomService:RoomsService) {
    this._activatedRouter.queryParams.subscribe((data:any)=>{
      this.hotelId = data.id;
      this.getPropertyList(data.id);
    });
  }
  ngOnInit(): void {

  }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getPropertyList(this.hotelId);
  };

  getSearchInput(searchValue: any) {
    let searchText = searchValue.toLowerCase();
    if (searchText === '') {
      this.dataSource = new MatTableDataSource(this.totalHotelsList);
    } else {
      let filteredResults;
      filteredResults = this.totalHotelsList.filter((list) => {
        let getValues = Object.values(list).toString().toLowerCase();
        return getValues.includes(searchText);
      });
      this.dataSource = new MatTableDataSource(filteredResults);
    }
  }

  getPropertyList(hotel_name:number) {
    this.onFirstLoad();
    let getCategory = 1;
    switch (this.selectedCategory) {
      case 'live':
        getCategory = 1;
        break;
      case 'in_active':
        getCategory = 0;
        break;
      case 'draft':
        getCategory = 2;
        break;
      case 'deleted':
        getCategory = 3;
        break;
      default:
        getCategory = 1;
        break;
    }

    this._roomService.getRoomList(this.hotelId).subscribe((res:any) => {
      if(res && res.status === 1) {
        this.dataSource = new MatTableDataSource(res.response);
        this.dataSource.paginator = this.paginator;
      }
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
    this.dataSource = new MatTableDataSource(this.totalHotelsList);
  }

  changePage(e: any) {
    console.log(e);
    this.pageOffset = e.pageIndex === 0 ? 0 : e.pageIndex * e.pageSize;
    this.pageSize = e.pageSize;
    this.getPropertyList(this.hotelId);
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

  getSearchDetails = (event: Event) => {
    event.preventDefault();
   // this.searchValue = (event.target as HTMLInputElement).value;
  };

  setSearchValue = (event: Event) => {
    event.preventDefault();
 //   this.getSearchInput.emit(this.searchValue);
  };

  gotoLink(event: Event) {
    event.preventDefault();
    this._route.navigate(['/add-room'], { queryParams: { id: this.hotelId } });
  }

  gotoEditLink(event:Event, roomID:any) {
    event.preventDefault();
    this._route.navigate(['/edit-room'], { queryParams: { id: this.hotelId, roomid: roomID } })
  }
}
