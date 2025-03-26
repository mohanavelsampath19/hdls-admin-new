import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MemberShip } from 'src/app/services/membership/membership.service';
import { Loading } from 'src/app/services/utilities/helper_models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/components/common/confirmation-modal/confirmation-modal.component';
import { InfoPopupComponent } from 'src/app/components/common/info-popup/info-popup.component';
import { FormGroup, FormControl } from '@angular/forms';
import { PointService } from 'src/app/services/points/point.service';

@Component({
  selector: 'app-pointsexplanation',
  templateUrl: './pointsexplanation.component.html',
  styleUrls: ['./pointsexplanation.component.scss']
})
export class PointsexplanationComponent implements OnInit {
  pointDetails: any = [];
  editUserDetails: boolean = false;
  isLoading:boolean = false;
  editPointDetailsForm = new FormGroup({
    pointId: new FormControl(),
    point_multiplier: new FormControl(),
    isActive: new FormControl(),
    edit: new FormControl(false),
  });
  mytransactionList:any = [];
  displayedColumns: string[] = [
    'date',
    'type',
    'totalamount',
    'mediancommission',
    'hoteldebit',
    'hotelcredit',
  ];
  dataSource:any = new MatTableDataSource(this.mytransactionList);
  pageSize: number = 5;
  pageOffset: number = 0;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  medianCommission:number = 0;
  debitMultiplier:number = 0 ;
  constructor(private _bookingService: BookingsService, private _dialog: MatDialog, private _pointService: PointService) {}

  ngOnInit(): void {
    this.getPointDetails();
    this.getBookingHistory();
  }

  getPointDetails() {
    this.isLoading = true;
    this._pointService.getPointDetails(2, 2).subscribe(
      (res: any) => {
        if (res && res.status === 1) {
          this.isLoading = false;
          console.log(res);
          this.pointDetails = res.response;
          this.medianCommission = this.pointDetails[8].point_multiplier * 0.01;
          this.debitMultiplier = this.pointDetails[1].point_multiplier;
        } else {
          console.log('Please try again', res);
        }
      },
      (error) => {
        console.log(error, ' API error');
      }
    );
  }
  editDetails(event: any, index: number) {
    event?.preventDefault();
    console.log(event);

    this.pointDetails[index].edit = true;
    console.log(this.pointDetails[index].edit);
    this.editPointDetailsForm.patchValue({
      pointId: this.pointDetails[index].pointsid,
      point_multiplier: this.pointDetails[index].point_multiplier,
      isActive: this.pointDetails[index].isactive,
    });
  }

  updateDetails(event: any, index: number) {
    event?.preventDefault();
    const { pointId, point_multiplier, isActive } =
      this.editPointDetailsForm.value;
    console.log(
      this.editPointDetailsForm.value,
      pointId,
      point_multiplier,
      isActive
    );
    this.pointDetails[index].edit = false;
    this.isLoading = true;
    this._pointService
      .updatePointMultiplier(pointId, point_multiplier)
      .subscribe(
        (res: any) => {
          if (res && res.status === 1) {
            this.getPointDetails();
          } else {
            console.log('Please try again', res);
          }
        },
        (error) => {
          console.log(error, ' API error');
        }
      );
  }
  getBookingHistory() {
    this._pointService.getCommissionDetails().subscribe((res:any) => {
      res.response.forEach((element:any) => {
        element.amount = parseFloat(element.medienwork) + parseFloat(element.hotel_debit) + parseFloat(element.hotel_credit);
      });
      let modifiedRes = [...res.response].reverse();
      this.dataSource = new MatTableDataSource(modifiedRes);

       this.dataSource.paginator = this.paginator;
    })
  }
}

