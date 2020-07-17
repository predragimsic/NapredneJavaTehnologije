import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Movie } from 'src/app/model/movie.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movies/movie.service';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';
import { Subscription } from 'rxjs';
import { Rating } from 'src/app/model/rating.model';
import { UserData } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
    selector: 'app-movie-details',
    templateUrl: './movie-details.page.html',
    styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
    movie: Movie;
    isLoading = false;
    average: number;
    rate: number;
    submitted = false;
    pressedRate = false;
    ratings: Rating[] = [];
    private ratingsSub: Subscription;
    user: UserData;

    constructor(private route: ActivatedRoute,
        private navCtrl: NavController,
        private moviesService: MovieService,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private movieService: MovieService,
        private cdRef : ChangeDetectorRef) {
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.rate = 0;
        this.isLoading = true;
        this.route.paramMap.subscribe((paramMap) => {
            if (!paramMap.has('movieId')) {
                this.navCtrl.navigateBack('/movies');
                return;
            }


            this.moviesService
                .getMovie(parseInt(paramMap.get('movieId'), 10), this.user)
                .subscribe((movie) => {
                    this.movie = movie;
                    this.calculate();
                    this.ratingsSub = this.movieService.ratings.subscribe((ratings) => {
                        this.ratings = ratings;
                        this.submitted = this.checkRating();

                    });
                    this.isLoading = false;
                });

        });


    }
    ionViewWillEnter() {
        this.movieService.getRatings(this.user).subscribe((ratings) => {
        });
    }
    checkRating() {
        const u = new User(this.user.id, this.user.email, this.user.password, this.user._token, this.user.name, this.user.surname);
        for (const r of this.ratings) {
            if (r.content.id === this.movie.id && r.user.id === u.id) {
                this.rate = r.rate;
                return true;
            }
        }
        return false;
    }

    onDeleteMovie() {
        this.loadingCtrl.create({ message: 'Deleting...' }).then(loadingEl => {
            loadingEl.present();
            this.moviesService.deleteMovie(this.movie.id, this.user).subscribe(() => {
                loadingEl.dismiss();
                this.navCtrl.navigateBack('/movies');
            });
        });
    }

    calculate() {
        if (this.movie.peopleRated === 0) {
            this.average = 0;
        }
        else {
            this.average = Math.round((this.movie.grade / this.movie.peopleRated) * 10) / 10;
        }
    }

    onEditMovie() {
        this.modalCtrl.create({
            component: MovieModalComponent,
            componentProps: { movie: this.movie }
        }).then((modal) => {
            modal.present();
            return modal.onDidDismiss();
        }).then((resultData) => {
            if (resultData.role === 'confirm') {
                console.log(resultData);

                const movie = new Movie(
                    this.movie.id,
                    resultData.data.movieData.name,
                    resultData.data.movieData.producer,
                    resultData.data.movieData.image,
                    resultData.data.movieData.description,
                    resultData.data.movieData.year,
                    resultData.data.movieData.country,
                    resultData.data.movieData.genre,
                    resultData.data.movieData.budget,
                    resultData.data.movieData.duration,
                    this.movie.grade,
                    this.movie.peopleRated);

                this.moviesService
                    .editMovie(
                        movie, this.user)
                    .subscribe((res) => {
                        this.movie = movie;
                    });
            }
        });
    }
    onRatePressed(event: number) {
        this.pressedRate = true;
        console.log(event);
        this.rate = event;
        this.cdRef.detectChanges();
    }
    onRateSubmit() {
        if (this.rate !== 0) {
            this.submitted = true;
            this.movie.grade += this.rate;
            this.movie.peopleRated++;
            this.calculate();
            const userRated = new User(this.user.id, this.user.email, this.user.password, this.user._token,
                this.user.name, this.user.surname);
            this.moviesService
                .editMovie(
                    this.movie, this.user)
                .subscribe((res) => {
                    this.movie = this.movie;
                });
            const ratingToAdd = new Rating(null, userRated, this.movie, this.rate);
            this.movieService.addRating(ratingToAdd, this.user).subscribe((res) => {
                console.log(res);
                this.ratings = this.ratings;
            });
        }


    }
    onRateRemove() {
        console.log('onRateRemove() this.movie.grade:' + this.movie.grade);
        console.log('onRateRemove() this.movie.peopleRated:' + this.movie.peopleRated);
        this.submitted = false;
        console.log(this.rate);
        this.movie.grade -= this.rate;
        this.movie.peopleRated--;
        console.log(' nakon onRateRemove() this.movie.grade:' + this.movie.grade);
        console.log('nakon onRateRemove() this.movie.peopleRated:' + this.movie.peopleRated);
        this.calculate();
        const userRated = new User(this.user.id, this.user.email, this.user.password, this.user._token, this.user.name, this.user.surname);
        this.moviesService.editMovie(this.movie, this.user).subscribe((res) => {
            this.movie = this.movie;
        });
        let rID: number;
        for (const r of this.ratings) {
            if (r.content.id === this.movie.id && r.user.id === userRated.id) {
                rID = r.id;
            }
        }
        this.movieService.deleteRating(rID, this.user).subscribe((res) => {
            console.log(res);
            this.ratings = this.ratings;
        });
        this.calculate();
    }
}
