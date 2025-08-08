import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-settle-popup',
  templateUrl: './settle-popup.component.html',
  styleUrls: ['./settle-popup.component.scss']
})
export class SettlePopupComponent {
  isLoading: boolean = false;
  settlement_notes: string = '';
  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<SettlePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: number, status: number },
    private _reportService: ReportsService
  ) {

  }

  confirmDelete() {
    this.isLoading = true;
    this._reportService.updatePaymentSettlement({ transactionId: this.data.bookingId, settlement_notes: this.settlement_notes }).subscribe((res:any)=>{
      console.log(res);
      this.isLoading = false;
      this.dialogRef.close(true);
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
