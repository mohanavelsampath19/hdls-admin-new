import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
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
    'no_of_rooms',
    'status',
    'action',
  ];
  dataSource: any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;

  constructor(private _inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.getPropertyList();
  }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getPropertyList();
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

  getPropertyList() {
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

    // this._inventoryService.getAllMembership().subscribe((memberShipArray:MemberShip[]) => {
    //   this.dataSource = new MatTableDataSource(memberShipArray);
    // })
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
    this.getPropertyList();
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
}
