import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { IonicModule } from '@ionic/angular';
import { MbscModule } from '@mobiscroll/angular';

import { CelebsPageRoutingModule } from './celebs-routing.module';

import { CelebsPage } from './celebs.page';
import { PopularActorsPageModule } from './popular-actors/popular-actors.module';
import { SearchActorsPageModule } from './search-actors/search-actors.module';
import { AddActorPageModule } from './add-actor/add-actor.module';

@NgModule({
  imports: [
    MbscModule,
    CommonModule,
    FormsModule,
    IonicModule,
    CelebsPageRoutingModule,
    SuperTabsModule,
    PopularActorsPageModule,
    SearchActorsPageModule,
    AddActorPageModule
  ],
  declarations: [CelebsPage]
})
export class CelebsPageModule {}
