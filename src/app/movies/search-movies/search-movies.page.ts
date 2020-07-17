import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from 'src/app/services/movies/movie.service';
import { Movie } from 'src/app/model/movie.model';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-search-movies',
  templateUrl: './search-movies.page.html',
  styleUrls: ['./search-movies.page.scss'],
})
export class SearchMoviesPage implements OnInit {
  searchText = '';
  movies: Movie[] = [];
  private moviesSub: Subscription;
  private user: UserData;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.moviesSub = this.movieService.movies.subscribe((movies) => {
      this.movies = movies;
    });
  }


  ionViewWillEnter() {
    this.movieService.getMovies(this.user).subscribe((movies) => {
      // this.movies = movies;
    });

  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.moviesSub) {
        this.moviesSub.unsubscribe();
    }
}


}
