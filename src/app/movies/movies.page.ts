import { Component, OnInit } from '@angular/core';
import { PopularMoviesPage } from './popular-movies/popular-movies.page';
import { SearchMoviesPage } from './search-movies/search-movies.page';
import { AddMoviePage } from './add-movie/add-movie.page';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  popular = PopularMoviesPage;
  search = SearchMoviesPage;
  add = AddMoviePage;

  constructor() { }

  ngOnInit() {
  }

}
