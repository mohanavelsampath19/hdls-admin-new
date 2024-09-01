import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteModalComponent } from 'src/app/components/common/delete-modal/delete-modal.component';
import {
  InventoryService,
  Inventorys,
} from 'src/app/services/inventory/inventory.service';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  selectedCategory: string = 'all';
  memberShipFilters: any = {
    categoryCounts: {
      live: '',
      in_active: '',
      draft: '',
      deleted: '',
    },
    inventoryList: [],
  };
  totalInventoryList: Array<Inventorys> = [];
  skeletonList: Array<Loading> = [
    { isLoading: true },
    { isLoading: true },
    { isLoading: true },
    { isLoading: true },
  ];
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    // 'property_id',
    'property_name',
    'total_rooms',
    'address',
    'city',
    'poc',
    'phone',
    'created_at',
    'action',
  ];
  dataSource: any = new MatTableDataSource(this.totalInventoryList);
  pageSize: number = 5;
  pageOffset: number = 0;
  propertyList: any=[];
  constructor(
    private _inventoryService: InventoryService,
    public dialog: MatDialog,
    private _router: Router
  ) {
    this.initializeHotelList();
  }
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
      this.dataSource = new MatTableDataSource(this.totalInventoryList);
    } else {
      let filteredResults;
      filteredResults = this.totalInventoryList.filter((list) => {
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
      case 'deleted':
        getCategory = 2;
        break;
      default:
        getCategory = 1;
        break;
    }
    this._inventoryService.getInventoryList(getCategory).subscribe((res:any) => {
      res.response && res.response.forEach((property:any)=>{
        property.logo = environment.imageUrl+"/"+property.logo;
        property.roomCount = property.rooms.reduce(function(acc:number,item:any){
          return acc = acc+item.totalrooms;
        },0);
      });
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.propertyList = res.response;
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
    this.dataSource = new MatTableDataSource(this.totalInventoryList);
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  setSearchValue = (event: Event) => {
    event.preventDefault();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  openDeleteDialog(event: Event, deleteid: any, status: any) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DeleteModalComponent, {data:{productName:'Hotel'}});
    const getDialogRef = dialogRef.componentInstance.onDelete.subscribe(
      (data) => {
        if (data === 'delete') {
          this._inventoryService
            .deleteHotel(deleteid)
            .subscribe((res: any) => {
              this.initializeHotelList();
              const dialogInfoRef = this.dialog.open(InfoPopupComponent, {
                data: {
                  popupText: 'Hotel Deleted successfully',
                },
              });
              const getInfoDialogRef =
              dialogInfoRef.componentInstance.closePopup.subscribe(() => {
                  this.dialog.closeAll();
                });
            });
        }
      },
      (error) => {
        alert(error);
        this.dialog.open(InfoPopupComponent, {
          data: {
            popupText: 'Something went wrong. Please try again later',
          },
        });
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      getDialogRef.unsubscribe();
    });
  }
  gotoLink(event: Event, id:any) {
    event.preventDefault();
    this._router.navigate(['/hotels'], { queryParams: { id: id } });
  }
  initializeHotelList(){
    this._inventoryService.getInventoryList().subscribe((res:any)=> {
      res.response.forEach((property:any)=>{
        property.logo = environment.imageUrl+"/"+property.logo;
        property.roomCount = property.rooms.reduce(function(acc:number,item:any){
          return acc = acc+item.totalrooms;
        },0);
      });
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.propertyList = res.response;
    })
  }

  redirectTo(event:any) {
    this._router.navigate(['/hotels'], { queryParams: { id: event.value } });
  }
}
