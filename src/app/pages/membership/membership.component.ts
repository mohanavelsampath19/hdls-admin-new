import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MemberShip, MembershipService } from 'src/app/services/membership/membership.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Loading } from 'src/app/services/utilities/helper_models';
import { DeleteModalComponent } from 'src/app/components/common/delete-modal/delete-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';

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
    'membership_image',
    'membership_name',
    'membership_desc',
    'price',
    'stock',
    'count',
    'status',
    'action',
  ];
  dataSource:any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;
  searchValue: any = '';
  constructor(
    private _memberShipService: MembershipService,
    public _dialog: MatDialog,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.getMembershipList();
  }

  getSearchDetails = (event: Event) => {
    event.preventDefault();
    this.dataSource.filter = this.searchValue?.trim()?.toLowerCase();
  };

  setSearchValue = (event: Event) => {
    event.preventDefault();
    this.dataSource.filter = this.searchValue?.trim()?.toLowerCase();
  };


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

    this._memberShipService.getAllMembersByCategory(getCategory).subscribe((memberShipRes:any) => {
      memberShipRes.response && memberShipRes.response.forEach((membership:any)=>{
        membership.image_url = "https://stage.tribeloyalty.my/upload/"+membership.image_url;
        membership.evouchers = JSON.parse(membership.evouchers);
        // membership.vouchersTitle = membership.vouchersList.map((member:any)=>{ if(member && member.voucherstitle){ return member.voucherstitle;}} );
        // console.log(membership.vouchersTitle)
      });

      this.dataSource = new MatTableDataSource(memberShipRes.response);
      this.dataSource.paginator = this.paginator;
    })
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  openDeleteDialog(event: Event, deleteid: any, status: any) {
    event.preventDefault();
    const dialogRef = this._dialog.open(DeleteModalComponent, {data:{productName:'Membership'}});
    const getDialogRef = dialogRef.componentInstance.onDelete.subscribe(
      (data) => {
        if (data === 'delete') {
          this._memberShipService
            .deleteMembership(deleteid)
            .subscribe((res: any) => {
              this.getMembershipList();
              const dialogInfoRef = this._dialog.open(InfoPopupComponent, {
                data: {
                  popupText: 'Membership Deleted successfully',
                },
              });
              const getInfoDialogRef = dialogInfoRef.componentInstance.closePopup.subscribe(() => {
                  this._dialog.closeAll();
                  this.getMembershipList();
                });
            });
        }
      },
      (error) => {
        alert(error);
        this._dialog.open(InfoPopupComponent, {
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
  changeActiveStatus(event:any,membershipId:any){
    this._memberShipService.updateMembershipStatus(membershipId,event.checked).subscribe((voucherRes:any)=>{
      if(voucherRes.status === 0) {
        this.getMembershipList();
      }
    })
  }
}
