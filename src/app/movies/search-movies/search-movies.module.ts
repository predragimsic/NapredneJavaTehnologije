import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Filter } from '../filter.pipe';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SearchMoviesPage } from './search-movies.page';
import { MovieElementComponent } from '../movie-element/movie-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  declarations: [SearchMoviesPage, Filter, MovieElementComponent],
  entryComponents: [SearchMoviesPage]
})
export class SearchMoviesPageModule {}
