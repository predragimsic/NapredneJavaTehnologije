import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorDetailsPageRoutingModule } from './actor-details-routing.module';

import { ActorDetailsPage } from './actor-details.page';
import { ActorModalComponent} from '../actor-modal/actor-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorDetailsPageRoutingModule
  ],
  declarations: [ActorDetailsPage, ActorModalComponent],
  entryComponents: [ActorModalComponent],
  providers:[DatePipe]
})
export class ActorDetailsPageModule {}
