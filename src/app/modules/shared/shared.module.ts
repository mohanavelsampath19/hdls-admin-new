import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/common/header/header.component';
import { SidenavComponent } from '../../components/common/sidenav/sidenav.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { HdlsDateRangeComponent } from '../../components/common/hdls-date-range/hdls-date-range.component';
import { InfoPopupComponent} from '../../components/common/info-popup/info-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteModalComponent } from '../../components/common/delete-modal/delete-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationModalComponent } from '../../components/common/confirmation-modal/confirmation-modal.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { BookingstatusPipe } from '../../pipes/bookingstatus.pipe';
import { ScanModalComponent } from '../../components/common/scan-modal/scan-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    HdlsDateRangeComponent,
    DeleteModalComponent,
    InfoPopupComponent,
    ConfirmationModalComponent,
    BookingstatusPipe,
    ScanModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    HttpClientModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatExpansionModule,
    MatGoogleMapsAutocompleteModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
    HdlsDateRangeComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    InfoPopupComponent,
    BookingstatusPipe,
    MatChipsModule,
    MatAutocompleteModule
  ],
})
export class SharedModule {}
