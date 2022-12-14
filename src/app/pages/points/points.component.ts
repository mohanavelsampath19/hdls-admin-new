import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PointService } from 'src/app/services/points/point.service';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  pointDetails: any = [];
  editUserDetails: boolean = false;

  editPointDetailsForm = new FormGroup({
    pointId: new FormControl(),
    point_multiplier: new FormControl(),
    isActive: new FormControl(),
    edit: new FormControl(false),
  });
  constructor(private _pointService: PointService) {}

  ngOnInit(): void {
    this.getPointDetails();
  }

  getPointDetails() {
    this._pointService.getPointDetails(2, 2).subscribe(
      (res: any) => {
        if (res && res.status === 1) {
          console.log(res);
          this.pointDetails = res.response;
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
}
