import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateInfoPageRoutingModule } from './update-info-routing.module';

import { UpdateInfoPage } from './update-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateInfoPageRoutingModule
  ],
  declarations: [UpdateInfoPage]
})
export class UpdateInfoPageModule {}
