import { FullInfoDetailComponent } from './full-info-detail/full-info-detail.component';
import { FullInfoComponent } from './full-info.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FullInfoComponent,
    children: [
      { path: '', component: FullInfoDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FullInfoRoutingModule { }
