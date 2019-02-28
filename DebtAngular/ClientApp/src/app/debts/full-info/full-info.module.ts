import { FullInfoService } from './full-info.service';
import { FullInfoDetailComponent } from './full-info-detail/full-info-detail.component';
import { FullInfoRoutingModule } from './full-info-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullInfoComponent } from './full-info.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FullInfoRoutingModule, FormsModule, CommonModule],
  declarations: [FullInfoComponent, FullInfoDetailComponent],
  providers: [FullInfoService]
})


export class FullInfoModule { }
