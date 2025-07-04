import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { MembershipService } from 'src/app/services/membership/membership.service';
import { LoginService } from 'src/app/services/login/login.service';



@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

   dataSource:any;
    userSearch:any;
    displayedColumns:any = ['member_id', 'name', 'mobile','membershipname', 'email', 'address', 'city', 'state', 'dob', 'signed_up_date', 'tier', 'points', 'booking_history', 'booking_id', 'current_membership'];
    resultsLength:number=0;
    @ViewChild(MatPaginator)
    paginator: MatPaginator | undefined;
    constructor(private _reportService:ReportsService, 
      private route: ActivatedRoute, private _membership: MembershipService,
    private _loginService: LoginService
    ) { 
      this.route.params.subscribe((param:any)=>{
        // this._membership.getAllMembership(param.id).subscribe((membershipDetails:any)=>{
        //   console.log(membershipDetails);
        // })
        this._loginService.getCustomerDetails(param.id).subscribe((user_details:any) => {
          this.dataSource = new MatTableDataSource([user_details.response]);
        this.dataSource.paginator = this.paginator;
        this.resultsLength = 1;
        })
      })
      
    }
  
    ngOnInit(): void {
    }

    gotoLink(event: Event) {
      event.preventDefault();
     // this.route.navigate(['/add-room'], { queryParams: { id: this.hotelId } });
    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      console.log(filterValue)
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    pageChanged(event:any){
      console.log(event);
  
    }

}
