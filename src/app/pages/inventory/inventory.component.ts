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
    'property_id',
    'property_name',
    'total_rooms',
    'status',
    'action',
  ];
  dataSource: any = new MatTableDataSource(this.totalInventoryList);
  pageSize: number = 5;
  pageOffset: number = 0;
  
  constructor(
    private _inventoryService: InventoryService,
    public dialog: MatDialog
  ) {
    this._inventoryService.currentInventory.subscribe((currentInventory)=>{
      console.log(currentInventory);
    });
    this._inventoryService.getMyInventoryList()
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

    // this._inventoryService.getMyInventoryList().subscribe((res:any) => {
    //   if(res && res.status === 1) {
    //     this.dataSource = new MatTableDataSource(res.response);
    //   }
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
    this.dataSource = new MatTableDataSource(this.totalInventoryList);
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

  openDeleteDialog(event: Event, deleteid: any, status: any) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DeleteModalComponent, {});
    // const getDialogRef = dialogRef.componentInstance.onDelete.subscribe(
    //   (data) => {
    //     if (data === 'delete') {
    //       this.tenantService
    //         .getDeleteProduct(deleteid, status)
    //         .subscribe((res: any) => {
    //           this.getProductList();
    //           const dialogRef = this.dialog.open(InfoPopupComponent, {
    //             data: {
    //               popupText: 'Product Deleted successfully',
    //             },
    //           });
    //           const getDialogRef =
    //             dialogRef.componentInstance.closePopup.subscribe(() => {
    //               this.dialog.closeAll();
    //             });
    //         });
    //     }
    //   },
    //   (error) => {
    //     alert(error);
    //     this.dialog.open(InfoPopupComponent, {
    //       data: {
    //         popupText: 'Something went wrong. Please try again later',
    //       },
    //     });
    //   }
    // );
    // dialogRef.afterClosed().subscribe(() => {
    //   getDialogRef.unsubscribe();
    // });
  }
}
