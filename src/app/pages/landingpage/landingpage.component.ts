import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ScanModalComponent } from 'src/app/components/common/scan-modal/scan-modal.component';
const channel4Broadcast = new BroadcastChannel('channel4');
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  sideBarOpen:boolean = true;
  constructor(private _router:Router, private _dialog:MatDialog) { 
    channel4Broadcast.onmessage = (event) => {
      console.log(event.data);
      this.openScanPopup(event.data);
    };
  }

  ngOnInit(): void {
    this.requestPermission();
    this.listen();
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BIkJwBkziSkUGof63saSJnlEURHHcUEfBNVpnj_nWkZOEZPIhwLbc5G24uhEnGG6PjbioSO33DJZsN1uyh2ba3o' }
    ).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           console.log(currentToken);
         } else {
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.openScanPopup(payload.data);
    });
  }
  sideBarToggler() {
    console.log("Checked",this.sideBarOpen)
    this.sideBarOpen = !this.sideBarOpen;
  }
  goToLink(routeObj:any){
    if(routeObj.queryParam){
      this._router.navigate([routeObj.routerLink],{queryParams:{'id':routeObj.queryParam}});
    }else{
      this._router.navigate([routeObj.routerLink]);
    }
  }
  openScanPopup(bookingInfo:any){
    const dialogRef = this._dialog.open(ScanModalComponent, {
      data: {
        productName:' Facility',
        bookingDetails:bookingInfo
      },
      width:'600px'
    });
    dialogRef.afterClosed().subscribe((desc:any) => {
      if(desc === true){
        
      }
    });
  }
}
