import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from '../../pages/inventory/inventory.component';
import { AddPropertyComponent } from '../../pages/inventory/add-property/add-property.component';
import { InventoryRoutingModule } from './inventory.routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EditPropertyComponent } from 'src/app/pages/inventory/edit-property/edit-property.component';

import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

import { AddRestaurantComponent } from '../../pages/inventory/add-restaurant/add-restaurant.component';
import { EditRestaurantComponent } from '../../pages/inventory/edit-restaurant/edit-restaurant.component';

@NgModule({
  declarations: [
    InventoryComponent,
    AddPropertyComponent,
    EditPropertyComponent,
    AddRestaurantComponent,
    EditRestaurantComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    InventoryRoutingModule,
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
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    NgxMaterialTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    AgmCoreModule,
    MatGoogleMapsAutocompleteModule
  ],
})
export class InventoryModule {}
