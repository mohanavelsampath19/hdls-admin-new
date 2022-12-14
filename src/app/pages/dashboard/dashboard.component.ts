import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sideBarOpen:boolean = true;
  mytheme:any='light-theme';
  title = 'af-notification';
  message:any = null;
  constructor() {
    
  }
  ngOnInit(): void {
    
  }

  
  changeTheme(e:any){
    document.getElementsByTagName('body')[0].classList.remove(this.mytheme);
    document.getElementsByTagName('body')[0].classList.add(e.target.value);
    this.mytheme = e.target.value;
  }
}
