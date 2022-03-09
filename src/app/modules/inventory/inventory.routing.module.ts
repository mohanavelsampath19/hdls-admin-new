import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from '../../pages/inventory/inventory.component';
import { AddPropertyComponent} from '../../pages/inventory/add-property/add-property.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent
  },
  {
    path: 'add-property',
    component: AddPropertyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
