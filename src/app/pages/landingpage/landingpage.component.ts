import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  sideBarOpen:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  sideBarToggler() {
    console.log("Checked",this.sideBarOpen)
    this.sideBarOpen = !this.sideBarOpen;
  }
}
