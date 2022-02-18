import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipComponent } from '../../pages/membership/membership.component';
import { RouterModule } from '@angular/router';
import { MemberShipRoutingModule } from './membership.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ProductstatusPipe } from 'src/app/filters/productstatus.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { AddVouchersComponent } from '../../pages/membership/add-vouchers/add-vouchers.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    MembershipComponent,
    ProductstatusPipe,
    AddVouchersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MemberShipRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatStepperModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatSlideToggleModule,
  ],
  bootstrap: [
    MembershipComponent
  ]
})
export class MembershipModule { }