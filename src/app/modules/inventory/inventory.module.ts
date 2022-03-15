import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from '../../pages/inventory/inventory.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class InventoryModule { }
