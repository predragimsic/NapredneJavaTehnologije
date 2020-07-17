import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AwardDetailsPageRoutingModule } from './award-details-routing.module';

import { AwardDetailsPage } from './award-details.page';
import { AwardModalComponent} from '../award-modal/award-modal.component';
import { IonicRatingModule } from 'ionic-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AwardDetailsPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [AwardDetailsPage, AwardModalComponent],
  entryComponents: [AwardModalComponent],
  providers:[DatePipe]
})
export class AwardDetailsPageModule {}
