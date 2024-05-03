import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesRoutingModule } from './facilities.routing.module';

import { FacilitiesComponent } from '../../pages/facilities/facilities.component';
import { AddFacilitiesComponent } from '../../pages/facilities/add-facilities/add-facilities.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FacilityTypePipe } from '../../pipes/facility-type.pipe';
import { EditFacilitiesComponent } from '../../pages/facilities/edit-facilities/edit-facilities.component';



@NgModule({
  declarations: [
    FacilitiesComponent,
    AddFacilitiesComponent,
    FacilityTypePipe,
    EditFacilitiesComponent
  ],
  imports: [
    CommonModule,
    FacilitiesRoutingModule,
    RouterModule,
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
  ]
})
export class FacilitiesModule { }
