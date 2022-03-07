import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMembershipComponent } from 'src/app/pages/membership/add-membership/add-membership.component';
import { AddVouchersComponent } from 'src/app/pages/membership/add-vouchers/add-vouchers.component';
import { MembershipComponent } from 'src/app/pages/membership/membership.component';
import { VouchersComponent } from 'src/app/pages/vouchers/vouchers.component';

const routes: Routes = [
  {
    path: '',
    component: MembershipComponent,
  },
  {
    path: 'add-membership',
    component: AddMembershipComponent,
  },
  {
    path: 'vouchers',
    component: VouchersComponent,
  },
  {
    path: 'add-vouchers',
    component: AddVouchersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberShipRoutingModule {}
