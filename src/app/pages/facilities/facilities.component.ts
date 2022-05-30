import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteModalComponent } from 'src/app/components/common/delete-modal/delete-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
import { MemberShip, MembershipService } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {

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
    'facility_name',
    'facility_desc',
    'facility_type',
    'property',
    'action',
  ];
  dataSource:any = new MatTableDataSource(this.totalMembershipList);
  pageSize: number = 5;
  pageOffset: number = 0;
  constructor(
    private _memberShipService: MembershipService,
    private _facilityService: FacilitiesService,
    public _dialog: MatDialog,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.getFacilityList();
  }

  getSelectedFilter = (value: string) => {
    this.selectedCategory = value;
    this.pageSize = 5;
    this.pageOffset = 0;
    this.getFacilityList();
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

  getFacilityList() {
    this.onFirstLoad();
    let getCategory = 0;
    switch (this.selectedCategory) {
      case 'live':
        getCategory = 0;
        break;
      case 'in_active':
        getCategory = 1;
        break;
      case 'deleted':
        getCategory = 2;
        break;
      default:
        getCategory = 0;
        break;
    }

    this._facilityService.getAllMembersByCategory(getCategory).subscribe((facilitiesRes:any) => {
      this.dataSource = new MatTableDataSource(facilitiesRes.response);
      this.dataSource.paginator = this.paginator;
    })
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  openDeleteDialog(event: any, deleteid: any, status: any) {
    event.preventDefault();
    const dialogRef = this._dialog.open(DeleteModalComponent, {data:{productName:event.facility_name}});
    const getDialogRef = dialogRef.componentInstance.onDelete.subscribe(
      (data) => {
        if (data === 'delete') {
          this._memberShipService
            .deleteMembership(deleteid)
            .subscribe((res: any) => {
              this.getFacilityList();
              const dialogInfoRef = this._dialog.open(InfoPopupComponent, {
                data: {
                  popupText: 'Membership Deleted successfully',
                },
              });
              const getInfoDialogRef = dialogInfoRef.componentInstance.closePopup.subscribe(() => {
                  this._dialog.closeAll();
                  this.getFacilityList();
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
    this.getFacilityList();
  }
  deleteFacility(deleteItem:any){
    const dialogRef = this._dialog.open(DeleteModalComponent, {
      data: {
        productName:deleteItem.facility_name+' Facility'
      },

    });
    dialogRef.afterClosed().subscribe((desc:any) => {
      if(desc === true){
        this._facilityService.deleteFacility(deleteItem.id).subscribe((deleteRes:any)=>{
          console.log(deleteRes);
          this.getFacilityList();
        })
      }
    });
  }
}
