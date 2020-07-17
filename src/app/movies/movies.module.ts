import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoviesPageRoutingModule } from './movies-routing.module';

import { MoviesPage } from './movies.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { PopularMoviesPageModule } from './popular-movies/popular-movies.module';
import { SearchMoviesPageModule } from './search-movies/search-movies.module';
import { AddMoviePageModule } from './add-movie/add-movie.module';

@NgModule({
  imports: [ 
    MbscModule, 
    CommonModule,
    FormsModule,
    IonicModule,
    MoviesPageRoutingModule,
    SuperTabsModule,
    PopularMoviesPageModule,
    SearchMoviesPageModule,
    AddMoviePageModule
  ],
  declarations: [MoviesPage]
})
export class MoviesPageModule {}
