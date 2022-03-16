import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  selectedMenu: string = '';
  openStatus: boolean = false;
  userLoggedInStatus: boolean = false;
  myMenu:any = {
    dashboard:true,
    membership:false,
    pointsystem:false,
    bookings:false,
    inventory:false
  }
  constructor( private _router: Router, private _inventory:InventoryService) {}
  ngOnInit() {

  }
  logout(event: any) {
    event.preventDefault();
    // this._cookieService.deleteAll();
    this.userLoggedInStatus = false;
    this._router.navigate(['/admin/login']);
  }

  renderChildmenu = (menuname: string) => {
    if (this.selectedMenu === '') {
      this.openStatus = false;
      this.selectedMenu = menuname;
    } else if (this.selectedMenu !== menuname) {
      this.openStatus = true;
      this.selectedMenu = menuname;
    } else {
      this.openStatus = !this.openStatus;
      this.selectedMenu = menuname;
    }
  };
  goToLink(routerLink:any,active:string){
    Object.keys(this.myMenu).forEach((item)=>{
      this.myMenu[item] = false;
    })
    this.myMenu[active] = true;
    this._router.navigate([routerLink]);
  }
  update(index:number){
    this._inventory.updateMyInventory(index);
  }
}
