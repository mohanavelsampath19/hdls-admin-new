import { EditRoomComponent } from './pages/edit-room/edit-room.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { LoginComponent } from './pages/login/login.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { AddVouchersComponent } from './pages/membership/add-vouchers/add-vouchers.component';
import { PointsystemComponent } from './pages/pointsystem/pointsystem.component';
import { AddRoomComponent } from './pages/add-room/add-room.component';
import { BookingsComponent } from './pages/bookings/bookings.component';

const routes: Routes = [
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
        path: 'hotels',
        component: HotelsComponent,
      },
      {
        path: 'vouchers',
        component: AddVouchersComponent,
      },
      {
        path: 'points',
        component: PointsystemComponent,
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
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  // {
  //   path: 'membership',
  //   loadChildren: () => import('./modules/membership/membership.module').then(member => member.MembershipModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
