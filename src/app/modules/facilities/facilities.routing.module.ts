import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFacilitiesComponent } from 'src/app/pages/facilities/add-facilities/add-facilities.component';
import { EditFacilitiesComponent } from 'src/app/pages/facilities/edit-facilities/edit-facilities.component';
import { FacilitiesComponent } from 'src/app/pages/facilities/facilities.component';



const routes: Routes = [
  {
    path: '',
    component: FacilitiesComponent,
  },
  {
      path:'add-facility',
      component: AddFacilitiesComponent
  },
  {
    path:'edit-facility/:id',
    component: EditFacilitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilitiesRoutingModule {}
