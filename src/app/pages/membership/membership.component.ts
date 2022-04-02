import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MemberShip, MembershipService } from 'src/app/services/membership/membership.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Loading } from 'src/app/services/utilities/helper_models';
import { DeleteModalComponent } from 'src/app/components/common/delete-modal/delete-modal.component';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

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
  skeletonList: Array<Loading> = [{isLoading:true},{isLoading:true},{isLoading:true},{isLoading:true},]
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'membership_name',
    'membership_desc',
    'price',
    'stock',
    'status',
    'action',
  ];
  dataSource:any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;
  constructor(
    private _memberShipService: MembershipService,
    public _dialog: MatDialog,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.getMembershipList();
  }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getMembershipList();
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

  getMembershipList() {
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

    this._memberShipService.getAllMembership().subscribe((memberShipRes:any) => {
      memberShipRes.response.forEach((membership:any)=>{
        membership.evouchers = JSON.parse(membership.evouchers);
        membership.vouchersTitle = membership.vouchersList.map((member:any)=>member.voucherstitle);
        console.log(membership.vouchersTitle)
      });
      
      this.dataSource = new MatTableDataSource(memberShipRes.response);
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
    this.getMembershipList();
  }
  deleteMembership(deleteMembership:any){
    const dialogRef = this._dialog.open(DeleteModalComponent, {
      data: {
        productName:deleteMembership.membershipname+' Membership'
      },
      
    });
    dialogRef.afterClosed().subscribe((desc:any) => {
      if(desc === true){
        this._memberShipService.deleteMembership(deleteMembership.membershipid).subscribe((deleteRes:any)=>{
          console.log(deleteRes);
          this.getMembershipList();
        })
      }
    });
  }
}
