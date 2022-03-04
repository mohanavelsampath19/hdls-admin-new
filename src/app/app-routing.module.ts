import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { LoginComponent } from './pages/login/login.component';
import { HotelsComponent} from './pages/hotels/hotels.component';

const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent,
    children:[
      {
        path:'dashboard',
        component:DashboardComponent
      },{
        path:'membership',
        loadChildren: () =>import('./modules/membership/membership.module').then((m) => m.MembershipModule)
      },
      {
        path:'inventory',
        component: InventoryComponent
      },
      {
        path: 'hotels',
        component: HotelsComponent
      }
    ]
  },
  {
    path:'login',
    component: LoginComponent
  },

  // {
  //   path: 'membership',
  //   loadChildren: () => import('./modules/membership/membership.module').then(member => member.MembershipModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
