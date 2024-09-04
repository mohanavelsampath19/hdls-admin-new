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
      console.log(event.data);
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
    getToken(messaging, { vapidKey: 'BA0nKzJXojvaY3GuU0TdYseaCvac35Aln6NQVNXJeDwCKyYpP0i_P07DCIdErMWRYMdcprBi-xwmFaznAIE_3kw' }
    ).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           let userid =JSON.parse(localStorage.getItem('loginRes') || '{}').loginRes.userid;
           console.log(currentToken);
           this._loginService.updateToken(userid,currentToken).subscribe((tokenServiceRes:any)=>{
            console.log("Token updated",tokenServiceRes);
           });
         } else {
           console.log('No registration token available. Request permission to generate one.');
           alert("You need to enable notification permission to get the live notification");
         }
     }).catch((err) => {
        alert("You need to enable notification permission to get the live notification");
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
