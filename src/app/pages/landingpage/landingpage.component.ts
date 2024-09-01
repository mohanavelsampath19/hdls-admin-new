import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ScanModalComponent } from 'src/app/components/common/scan-modal/scan-modal.component';
import { LoginService } from 'src/app/services/login/login.service';
const channel4Broadcast = new BroadcastChannel('channel4');
const channel5Broadcast = new BroadcastChannel('listenScanPopup');
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  sideBarOpen:boolean = true;
  constructor(private _router:Router, private _dialog:MatDialog, private _loginService:LoginService) { 
    if(!localStorage.getItem('logged-in-user')){
      this._router.navigate(['login'])
    }
    channel4Broadcast.onmessage = (event) => {
      channel5Broadcast.postMessage(event.data);
      if(event.data.payload){
        this.openScanPopup(event.data.payload);  
      }else{
        this.openScanPopup(event.data);
      }
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
          
           let userid =JSON.parse(localStorage.getItem('loginRes') || '{}').loginRes.userid;
           
           this._loginService.updateToken(userid,currentToken).subscribe((tokenServiceRes:any)=>{
            
           });
         } else {
           alert("You need to enable notification permission to get the live notification");
         }
     }).catch((err) => {
        alert("You need to enable notification permission to get the live notification");
    });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.openScanPopup(payload.data);
    });
  }
  sideBarToggler() {
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
