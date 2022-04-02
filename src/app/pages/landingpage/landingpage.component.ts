import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  sideBarOpen:boolean = true;
  constructor(private _router:Router) { }

  ngOnInit(): void {
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
}
