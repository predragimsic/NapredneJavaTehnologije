import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Movie } from 'src/app/model/movie.model';
import { Subscription } from 'rxjs';
import { MovieService } from 'src/app/services/movies/movie.service';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Content } from 'src/app/model/content.model';
import { SeriesService } from 'src/app/services/series/series.service';
import { Series } from 'src/app/model/series.model';
import { UserData } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit {
  movies: Movie[] = [];
  contents: Content[] = [];
  private moviesSub: Subscription;
  series: Series[] = [];
  private seriesSub: Subscription;
  user : UserData;

  @ViewChild('addForm', { static: true }) form: NgForm;
  @Input() name: string;
  @Input() image: string;
  @Input() content: Content;

  constructor(private movieService: MovieService,
    private seriesService: SeriesService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.fillContent();
  }


  ionViewWillEnter() {
    this.movieService.getMovies(this.user).subscribe((movies) => {
      // this.movies = movies;
    });
    this.seriesService.getSeries(this.user).subscribe((series) => {
      // this.movies = movies;
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.moviesSub) {
      this.moviesSub.unsubscribe();
    }
    if (this.seriesSub) {
      this.seriesSub.unsubscribe();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  fillContent() {
    this.moviesSub = this.movieService.movies.subscribe((movies) => {
      this.movies = movies;
      this.movies.sort((a, b) => a.name.localeCompare(b.name));
      if (!this.contents.includes(this.movies[0])) {
        for (const m of this.movies) {
          this.contents.push(m);
        }
      }

    });
    this.seriesSub = this.seriesService.series.subscribe((series) => {
      this.series = series;
      this.series.sort((a, b) => a.name.localeCompare(b.name));
      if (!this.contents.includes(this.series[0])) {
        for (const s of this.series) {
          this.contents.push(s);
        }
      }
    });
  }

  onAddRole() {
    if (!this.form.valid) {
      return;
    }

    this.modalCtrl.dismiss({
      roleData:
      {
        name: this.form.value.name,
        image: this.form.value.image,
        content: this.form.value.content
      }
    }, 'confirm');

  }

}
