import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddActorPage } from './add-actor.page';
import { RoleModalComponent } from '../role-modal/role-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [AddActorPage, RoleModalComponent],
  entryComponents: [ RoleModalComponent]
})
export class AddActorPageModule {}
