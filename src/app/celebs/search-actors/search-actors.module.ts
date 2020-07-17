import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FilterPipe } from '../filter.pipe';
import { SearchActorsPage } from './search-actors.page';
import { ActorElementComponent } from '../actor-element/actor-element.component';
// dodati ActorElement import
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  declarations: [SearchActorsPage, FilterPipe, ActorElementComponent],
  entryComponents: [SearchActorsPage]
})
export class SearchActorsPageModule {}
