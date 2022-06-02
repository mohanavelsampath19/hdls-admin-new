import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteModalComponent } from 'src/app/components/common/delete-modal/delete-modal.component';
import {
  MemberShip,
  MembershipService,
} from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss'],
})
export class VouchersComponent implements OnInit {
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
  @ViewChild(MatPaginator) paginator: any;

  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'voucher_name',
    'voucher_id',
    'price',
    'points',
    'stock',
    'status',
    'action',
  ];

  dataSource: any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;
  constructor(private _membershipService: MembershipService, private _dialog: MatDialog) { }

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
    let getCategory = 3;
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
        getCategory = 3;
        break;
    }

    this._membershipService.getVoucherList(getCategory).subscribe((vouchersRes: any) => {
      vouchersRes.response.forEach((property: any) => {
        property.logo = environment.imageUrl + "/" + property.logo;
      });
      this.dataSource = new MatTableDataSource(vouchersRes.response);
      this.paginator.length = vouchersRes.response.length;
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
  deleteVouchers(voucher_id: number, vouchertitle: string) {
    console.log(voucher_id, '---')
    const dialogRef = this._dialog.open(DeleteModalComponent, {
      data: {
        productName: vouchertitle,
        popupText: 'Are you sure you want to Delete the Voucher',
        voucherId: voucher_id
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      if (data === true) {
        this._membershipService.deleteVouchers(voucher_id).subscribe((deleteRes: any) => {
          //  console.log(deleteRes);
          this.getPropertyList();
        })
      }
    });
  }
  changeActiveStatus(event:any,voucherId:any){
    this._membershipService.updateVoucherActiveStatus(voucherId,event.checked).subscribe((voucherRes:any)=>{
      console.log(voucherRes);
    })
  }
}
