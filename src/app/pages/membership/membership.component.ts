import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  selectedCategory: string = 'all';
  productDetails: any = {
    categoryCounts: {
      live: '',
      in_active: '',
      draft: '',
      deleted: '',
    },
    productList: [],
  };
  totalProductList: Array<any> = [];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  
  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    // 'product_thumbnail',
    'product_name',
    'original_price',
    'sales_price',
    'tenant_name',
    'tenant_id',
    'status'
  ];
  dataSource = new MatTableDataSource(this.totalProductList);
  pageSize: number = 5;
  pageOffset: number = 0;
  constructor(
    private _adminService: MembershipService,
    public dialog: MatDialog,
    private _router: Router
  ) {     
  }

  ngOnInit(): void {
    this.getProductList();
  }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getProductList();
  };

  getSearchInput(searchValue: any) {
    let searchText = searchValue.toLowerCase();
    if (searchText === '') {
      this.dataSource = new MatTableDataSource(this.totalProductList);
    } else {
      let filteredProducts;
      filteredProducts = this.totalProductList.filter((list) => {
        let getValues = Object.values(list).toString().toLowerCase();
        return getValues.includes(searchText);
      });
      this.dataSource = new MatTableDataSource(filteredProducts);
    }
  }

  getProductList() {
    this.updateLoaderData();
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
    let getProductDetails = {
      pageSize: this.pageSize,
      pageOffset: this.pageOffset,
      category: getCategory,
      allProducts: this.selectedCategory === 'all' ? true : false
    };
    // this._adminService
    //   .getAllMyProducts({ ...getProductDetails })
    //   .subscribe((res: any) => {
    //     res.response.map((product: any) => {
    //       product.variants =
    //         typeof product.variants === 'string'
    //           ? JSON.parse(product.variants)
    //           : product.variants;
    //     });
    //     if (res && res.status === 0) {
    //       this.productDetails = {
    //         categoryCounts: {
    //           live: res.productCount.live,
    //           in_active: res.productCount.in_active,
    //           draft: res.productCount.draft,
    //           deleted: res.productCount.deleted,
    //         },
    //         productList: [],
    //       };
    //       if (this.selectedCategory === 'all') {
    //         this.paginator.length = res.productCount.productTotalCount;
    //       } else {
    //         this.paginator.length = res.productCount[this.selectedCategory];
    //       }
    //       this.totalProductList = res.response;
    //       console.log(this.totalProductList);
    //       this.updateImage();
    //     }
    //   });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }



  deleteProduct() {
    this.dialog.closeAll();
  }
  updateLoaderData() {
    this.totalProductList = [
      {
        loading: true,
      },
      {
        loading: true,
      },
      {
        loading: true,
      },
      {
        loading: true,
      },
    ];

    this.dataSource = new MatTableDataSource(this.totalProductList);
    // this.dataSource.paginator = this.paginator;
  }
  updateImage() {
    this.dataSource = new MatTableDataSource(this.totalProductList);
  }
  changePage(e: any) {
    console.log(e);
    this.pageOffset = e.pageIndex === 0 ? 0 : e.pageIndex * e.pageSize;
    this.pageSize = e.pageSize;
    this.getProductList();
  }

  editProduct(event: any, id: any) {
    event.preventDefault();
    console.log(id);
    this._router.navigate(['/tenant/edit-product'], {
      queryParams: { id: id },
    });
  }

}
