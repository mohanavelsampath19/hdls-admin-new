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
  isMembershipPermissionExist:boolean = false;
  isReportPermissionExist:boolean = false;
  isBookingPermissionExist:boolean = false;
  isPointPermissionExist:boolean = false;
  isInventoryPermisssionExist:boolean = false;
  isFacilityPermissionExist:boolean = false;
  isUserRolePermissionExist:boolean = false;
  myMenu: any = {
    dashboard: true,
    membership: false,
    pointsystem: true,
    bookings: false,
    inventory: false,
    addUser: false
  };
  inventoryList: any = [];
  @Output() routeToLink: EventEmitter<any> = new EventEmitter();
  constructor(private _router: Router, private _inventory: InventoryService) {
    let loginResponseObj:any = JSON.parse(localStorage.getItem('loginRes') || '{}');
    let availableFeatures = JSON.parse(loginResponseObj.loginRes.available_features).available_features;
    this.isMembershipPermissionExist = availableFeatures.indexOf('membership')>-1 ? true: false;
    this.isReportPermissionExist = availableFeatures.indexOf('reports')>-1 ? true: false;
    this.isBookingPermissionExist = availableFeatures.indexOf("bookings")>-1 ? true: false;
    this.isPointPermissionExist = availableFeatures.indexOf("points")>-1 ? true: false;
    this.isInventoryPermisssionExist = availableFeatures.indexOf("inventory")>-1 ? true: false;
    this.isFacilityPermissionExist = availableFeatures.indexOf("facility")>-1 ? true: false;
    this.isUserRolePermissionExist = localStorage.getItem('logged-in-user')=='hdlsadmin' ? true:false;
    this._inventory.getInventoryList().subscribe((inventoryList: any) => {
      this.inventoryList = inventoryList.response;
    },(error:any)=>{
      console.log(error);
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
