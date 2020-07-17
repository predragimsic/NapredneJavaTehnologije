import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CelebsPage } from './celebs.page';

const routes: Routes = [
  {
    path: '',
    component: CelebsPage
  },
  {
    path: ':actorId',
    loadChildren: () => import('./actor-details/actor-details.module').then( m => m.ActorDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CelebsPageRoutingModule {}
