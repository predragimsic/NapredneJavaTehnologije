import { Component, OnInit } from '@angular/core';
import { mobiscroll, MbscListviewOptions } from '@mobiscroll/angular';
import { Movie } from 'src/app/model/movie.model';
import { Subscription } from 'rxjs';
import { MovieService } from 'src/app/services/movies/movie.service';
import { Genre } from 'src/app/model/genre.model';
import { LoadingController } from '@ionic/angular';
import { UserData } from 'src/app/auth/auth.service';

mobiscroll.settings = {
  theme: 'ios',
  themeVariant: 'light'
};


@Component({
  selector: 'app-popular-movies',
  templateUrl: './popular-movies.page.html',
  styleUrls: ['./popular-movies.page.scss'],
})
export class PopularMoviesPage implements OnInit {
  isLoading = false;
  movies: Movie[] = [];
  genres = ['Action', 'Thriller', 'Drama', 'Comedy', 'Mistery', 'Romantic', 'SciFi', 'Crime', 'Western', 'Documentary', 'Animated',
    'Adventure', 'Horror', 'Fantasy', 'Family', 'Biography', 'War', 'History', 'Musical', 'Sport'];
  first: string;
  second: string;
  third: string;
  private moviesSub: Subscription;
  private user: UserData;

  listSettings: MbscListviewOptions = {
    stages: [{
      percent: -20,
      action: (event, inst) => {
        inst.remove(event.target);
        return false;
      }
    }, {
      percent: 20,
      action: (event, inst) => {
        inst.remove(event.target);
        return false;
      }
    }],
    actionable: false
  };

  cycleSettings: MbscListviewOptions = {
    stages: [{
      percent: -20,
      action: (event, inst) => {
        inst.move(event.target, 0);
        return false;
      }
    }, {
      percent: 20,
      action: (event, inst) => {
        inst.move(event.target, 0);
        return false;
      }
    }],
    actionable: false
  };

  constructor(private movieService: MovieService,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.moviesSub = this.movieService.movies.subscribe((movies) => {
      this.movies = movies;

      this.isLoading = true;

      let f = 0;
      let s = 0;
      let t = 0;

      for (const g of this.genres) {
        let i = 0;
        for (const m of this.movies) {
          if (g === m.genre.name) {
            i++;
          }
        }
        if (i > f) {
          f = i;
          this.first = g;
        }
        else if (i > s) {
          s = i;
          this.second = g;
        }
        else if (i > t) {
          t = i;
          this.third = g;
        }

      }
      this.isLoading = false;
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.moviesSub) {
        this.moviesSub.unsubscribe();
    }
}

  ionViewWillEnter() {
    this.movieService.getMovies(this.user).subscribe((movies) => {
      // this.movies = movies;
    });
  }

}
