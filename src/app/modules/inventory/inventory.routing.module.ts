import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from '../../pages/inventory/inventory.component';
import { AddPropertyComponent } from '../../pages/inventory/add-property/add-property.component';
import { EditPropertyComponent } from 'src/app/pages/inventory/edit-property/edit-property.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
  },
  {
    path: 'add-property',
    component: AddPropertyComponent,
  },
  {
    path: 'edit-property',
    component: EditPropertyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
