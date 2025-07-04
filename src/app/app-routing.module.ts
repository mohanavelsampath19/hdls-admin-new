import { PointsComponent } from './pages/points/points.component';
import { EditRoomComponent } from './pages/hotels/edit-room/edit-room.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { LoginComponent } from './pages/login/login.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { AddVouchersComponent } from './pages/vouchers/add-vouchers/add-vouchers.component';
import { PointsystemComponent } from './pages/pointsystem/pointsystem.component';
import { AddRoomComponent } from './pages/hotels/add-room/add-room.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { VouchersComponent } from './pages/vouchers/vouchers.component';
import { EditVouchersComponent } from './pages/vouchers/edit-vouchers/edit-vouchers.component';
import { ReportComponent } from './report/report.component';
import { UsersComponent } from './report/users/users.component';
import { MembershipComponent } from './report/membership/membership.component';
import { TransactionsComponent } from './report/transactions/transactions.component';
import { HomeComponent } from './pages/web/home/home.component';
import { SignupComponent } from './pages/web/signup/signup.component';
import { FaqsComponent } from './pages/web/faqs/faqs.component';
import { TermsComponent } from './pages/web/terms/terms.component';
import { SuccessComponent } from './pages/web/success/success.component';
import { PointsTableComponent } from './components/common/points-table/points-table.component';
import { TierpointsComponent } from './pages/tierpoints/tierpoints.component';
import { PointsexplanationComponent } from './pages/pointsexplanation/pointsexplanation.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { PointsSummary } from './report/points-summary/points-summary.component';
import { MemberDetailsComponent } from './report/member-details/member-details.component';
import { BookingDetailsComponent } from './report/booking-details/booking-details.component';



const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'faqs',
    component:FaqsComponent
  },
  {
    path:'terms',
    component:TermsComponent
  },
  {
    path:'success',
    component:SuccessComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LandingpageComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./modules/inventory/inventory.module').then(
            (m) => m.InventoryModule
          ),
      },
      {
        path: 'membership',
        loadChildren: () =>
          import('./modules/membership/membership.module').then(
            (m) => m.MembershipModule
          ),
      },
      {
        path: 'facilities',
        loadChildren: () =>
          import('./modules/facilities/facilities.module').then(
            (facility) => facility.FacilitiesModule
          ),
      },
      {
        path: 'hotels',
        component: HotelsComponent,
      },
      {
        path: 'vouchers',
        component: VouchersComponent,
      },
      {
        path: 'add-vouchers',
        component: AddVouchersComponent,
      },
      {
        path: 'points',
        component: PointsComponent
      },
      {
        path:'tierpoints',
        component:TierpointsComponent
      },
      {
        path: 'add-room',
        component: AddRoomComponent,
      },
      {
        path: 'edit-room',
        component: EditRoomComponent,
      },
      {
        path: 'bookings',
        component: BookingsComponent,
      },
      {
        path: 'edit-vouchers/:id',
        component: EditVouchersComponent,
      },
      {
        path:'report',
        component: ReportComponent,
        children:[
          {
            path:'users',
            component:UsersComponent
          },
          {
            path:'membership',
            component:MembershipComponent
          },
          {
            path:'transaction',
            component:TransactionsComponent
          },
          {
            path: 'points-summary',
            component: PointsSummary
          },
          {
            path: 'member-details/:id',
            component: MemberDetailsComponent
          },
          {
            path: 'booking-details/:id',
            component: BookingDetailsComponent
          }
        ]
      },
      {
        path: 'commissiondetails',
        component: PointsexplanationComponent
      },
      {
        path: 'add-user',
        component: AddUserComponent
      }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
