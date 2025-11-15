import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ViewexpensesComponent } from 'src/app/components/common/viewexpenses/viewexpenses.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { BookingDetailsComponentPopup } from 'src/app/components/popups/booking-details/booking-details.component';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

   dataSource:any;
    userSearch:any;
  displayedColumns:any = ['sno','name','mobile','email','address','city','state','dob','created_at','status','tier','points','booking_history','current_membership'];
    resultsLength:number=0;
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;

  selectedTier: string = 'all';
  UserListRes:any = [];
    constructor(private _reportService:ReportsService, private _dialog:MatDialog, private _router:ActivatedRoute) { 
        this._reportService.getUserList().subscribe((userList:any)=>{
          console.log(userList);
            
           this._router.params.subscribe((params:any) => {
            console.log(params.id);
            this.UserListRes = userList.response.map((user:any)=> {
              let pointAccumulated = user.points_summary.reduce((acc:any, curr:any) => {
                return acc + (curr.credit || 0);
              }, 0);
              return { ...user, pointsAccumulated: pointAccumulated };
            });
            this.dataSource = new MatTableDataSource(this.UserListRes.filter((user:any) =>
              user.customerid == params.id
            ));
            this.dataSource.paginator = this.paginator;
            this.resultsLength = userList.response.length;
           });
        });
        
      }
    
      ngOnInit(): void {
      }
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
      pageChanged(event:any){
        console.log(event);
    
      }
      openExpenseDialog(userId:number) {
          const dialogRef = this._dialog.open(ViewexpensesComponent, {data:{user_id:userId}});
      }
      changeTier(tier:string) {
        this.selectedTier = tier;
        if (tier === 'all') {
          this.dataSource.data = this.UserListRes;
        }else{
          this.dataSource.data = this.UserListRes.filter((user:any) => user.pointsTier === this.selectedTier);
        }
      }
    openBookingDetails(customerId:number){

          const dialogRef = this._dialog.open(BookingDetailsComponentPopup, {
            data: {
              userId: customerId
            },
            width:'1200px'
          });
          dialogRef.afterClosed().subscribe((desc:any) => {
            if(desc === true){
              
            }
          });
       
        
      }
}
