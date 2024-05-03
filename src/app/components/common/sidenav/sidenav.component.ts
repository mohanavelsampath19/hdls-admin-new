import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  selectedMenu: string = '';
  openStatus: boolean = false;
  userLoggedInStatus: boolean = false;
  myMenu: any = {
    dashboard: true,
    membership: false,
    pointsystem: false,
    bookings: false,
    inventory: false,
  };
  inventoryList: any = [];
  @Output() routeToLink: EventEmitter<any> = new EventEmitter();
  constructor(private _router: Router, private _inventory: InventoryService) {
    this._inventory.getInventoryList().subscribe((inventoryList: any) => {
      this.inventoryList = inventoryList.response;
    });
  }
  ngOnInit() {}
  logout(event: any) {
    event.preventDefault();
    localStorage.removeItem('logged-in-user');
    localStorage.clear();
    this.userLoggedInStatus = false;
    this._router.navigate(['login']);
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
  goToLink(routerLink: any, active: string, queryParam?: string) {
    Object.keys(this.myMenu).forEach((item) => {
      this.myMenu[item] = false;
    });
    this.myMenu[active] = true;
    if (queryParam) {
      let routeObj = {
        routerLink: routerLink,
        queryParam: queryParam,
      };
      this.routeToLink.emit(routeObj);
    } else {
      let routeObj = {
        routerLink: routerLink,
        queryParam: queryParam,
      };
      this.routeToLink.emit(routeObj);
    }
  }
  update(index: number) {
    this._inventory.updateMyInventory(index);
  }
}
