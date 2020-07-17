import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Movie } from 'src/app/model/movie.model';
import { ModalController } from '@ionic/angular';
import { Genre } from 'src/app/model/genre.model';
import { Subscription } from 'rxjs';
import { MovieService } from 'src/app/services/movies/movie.service';

@Component({
  selector: 'app-movie-modal',
  templateUrl: './movie-modal.component.html',
  styleUrls: ['./movie-modal.component.scss'],
})
export class MovieModalComponent implements OnInit {
  @ViewChild('f', { static: true }) form: NgForm;
  @Input() movie: Movie;

  years = [];
  genre: Genre;
  genres: Genre[] = [];
  private genresSub: Subscription;

  constructor(private modalCtrl: ModalController, private movieService: MovieService) { }

  ngOnInit() {
    this.genre = this.movie.genre;
    console.log(this.genre.name);
    this.fillYears();
    this.fillGenres();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.genresSub) {
        this.genresSub.unsubscribe();
    }
}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  fillYears() {
    for (let i = 2020; i >= 1920; i--) {
      this.years.push(i);
    }
  }

  fillGenres() {
    this.genresSub = this.movieService.genres.subscribe((newGenres) => {
      this.genres = newGenres;
      this.genres.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
  onEditMovie() {
    if (!this.form.valid) {
      return;
    }

    this.modalCtrl.dismiss({
      movieData:
      {
        name: this.form.value.name,
        producer: this.form.value.producer,
        image: this.form.value.image,
        description: this.form.value.description,
        year: this.form.value.year,
        country: this.form.value.country,
        genre: this.form.value.genre,
        budget: this.form.value.budget,
        duration: this.form.value.duration
      }
    }, 'confirm');

  }

 

}
