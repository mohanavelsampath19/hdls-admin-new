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

import { RouterModule } from '@angular/router';
import { AddMembershipComponent } from './pages/membership/add-membership/add-membership.component';
//import { InventoryComponent } from './pages/inventory/inventory.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { AddRoomComponent } from './pages/hotels/add-room/add-room.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { PointsystemModule } from './modules/pointsystem/pointsystem.module';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { EditRoomComponent } from './pages/hotels/edit-room/edit-room.component';
import { VouchersComponent } from './pages/vouchers/vouchers.component';
import { AddVouchersComponent } from './pages/vouchers/add-vouchers/add-vouchers.component';
import { EditMembershipComponent } from './pages/membership/edit-membership/edit-membership.component';

// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { EditVouchersComponent } from './pages/vouchers/edit-vouchers/edit-vouchers.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IvyCarouselModule } from 'angular-responsive-carousel';
initializeApp(environment.firebase);

const config: SocketIoConfig = {
  url: environment.socketUrl, // socket server url;
  options: {
    transports: ['websocket'],
  },
};

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
    EditRoomComponent,
    AddVouchersComponent,
    VouchersComponent,
    EditMembershipComponent,
    EditVouchersComponent,
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
    MatPaginatorModule,
    // NgxMaterialTimepickerModule,
    MatGoogleMapsAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBPFJayQZ1SGLO7W_p0FAMRR552UdLhr3s',
      libraries: ['places'],
    }),
    GooglePlaceModule,
    MatSlideToggleModule,
    SocketIoModule.forRoot(config),
    IvyCarouselModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
