import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from './modules/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ProductstatusPipe } from './filters/productstatus.pipe';
import { RouterModule } from '@angular/router';
import { AddMembershipComponent } from './pages/membership/add-membership/add-membership.component';
//import { InventoryComponent } from './pages/inventory/inventory.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { AddRoomComponent } from './pages/add-room/add-room.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { PointsystemModule } from './modules/pointsystem/pointsystem.module';
import { BookingsComponent } from './pages/bookings/bookings.component';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    LandingpageComponent,
    AddMembershipComponent,
    HotelsComponent,
    AddRoomComponent,
    BookingsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatChipsModule,
    MatToolbarModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
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
    AngularEditorModule,
    MatRadioModule,
    MatDialogModule,
    HttpClientModule,
    PointsystemModule,
    // NgxMaterialTimepickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
