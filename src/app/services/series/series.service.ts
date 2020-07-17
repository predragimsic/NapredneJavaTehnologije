import { Injectable } from '@angular/core';
import { Genre } from 'src/app/model/genre.model';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { AuthService, UserData } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Series } from 'src/app/model/series.model';
import { Rating } from 'src/app/model/rating.model';
import { User } from 'src/app/auth/user.model';
import { Content } from 'src/app/model/content.model';

interface GenreData {
  id: number;
  name: string;
}

export interface SeriesData {
  id: number;
  name?: string;
  producer?: string;
  image: string;
  description: string;
  year: number;
  genre: Genre;
  country: string;
  numberOfSeasons: number;
  averageDuration: number;
  grade: number;
  peopleRated: number;
}

export interface RatingData {
  id: number;
  user: User;
  content: Content;
  rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  // tslint:disable-next-line: variable-name
  private _genres = new BehaviorSubject<Genre[]>([]);
  // tslint:disable-next-line: variable-name
  private _series = new BehaviorSubject<Series[]>([]);
  // tslint:disable-next-line: variable-name
  private _ratings = new BehaviorSubject<Rating[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get genres() {
    return this._genres.asObservable();
  }

  get series() {
    return this._series.asObservable();
  }

  get ratings() {
    return this._ratings.asObservable();
  }

  makeAToken(user: UserData) {
    const tok = user.email + ':' + user.password;
    const hash = btoa(tok);
    return 'Basic ' + hash;
  }

  getGenres(user: UserData) {
    console.log('getGenres service');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [id: number]: GenreData }>(
            `http://localhost:8080/cineman/genre?id=` + user.id
            , httpOptions);
      }),
      map((genresData) => {
        console.log(genresData);
        const genres: Genre[] = [];
        // tslint:disable-next-line: forin
        for (const id in genresData) {
          console.log(genresData[id].id);
          if (genresData.hasOwnProperty(id)) {
            genres.push(
              new Genre(
                // tslint:disable-next-line: radix
                genresData[id].id,
                genresData[id].name
              ));
          }
        }
        return genres;
      }),
      tap(genres => {
        this._genres.next(genres);
      })
    );

  }

  getRatings(user: UserData) {
    console.log('getRatings service');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [id: number]: RatingData }>(
            `http://localhost:8080/cineman/rating?id=` + user.id
            , httpOptions);
      }),
      map((ratingData) => {
        console.log(ratingData);
        const ratings: Rating[] = [];
        for (const id in ratingData) {
          if (ratingData.hasOwnProperty(id)) {
            ratings.push(
              new Rating(
                ratingData[id].id,
                ratingData[id].user,
                ratingData[id].content,
                ratingData[id].rate
              ));
          }
        }
        return ratings;
      }),
      tap(ratings => {
        this._ratings.next(ratings);
      })
    );

  }

  getSeries(user: UserData) {
    console.log('getSeries service');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [id: number]: SeriesData }>(
            `http://localhost:8080/cineman/show?id=` + user.id
            , httpOptions);
      }),
      map((seriesData) => {
        console.log(seriesData);
        const series: Series[] = [];
        for (const key in seriesData) {
          if (seriesData.hasOwnProperty(key)) {
            series.push(
              new Series(
                seriesData[key].id,
                seriesData[key].name,
                seriesData[key].producer,
                seriesData[key].image,
                seriesData[key].description,
                seriesData[key].year,
                seriesData[key].country,
                seriesData[key].genre,
                seriesData[key].numberOfSeasons,
                seriesData[key].averageDuration,
                seriesData[key].grade,
                seriesData[key].peopleRated

              ));
          }
        }
        return series;
      }),
      tap(series => {
        this._series.next(series);
      })
    );

  }

  addShow(show: Series, user: UserData) {
    let generatedId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };

    return this.http
      .post<{ id: number }>(
        `http://localhost:8080/cineman/show/add?id=` + user.id,
        show,
        httpOptions).pipe(
          switchMap((resData) => {
            generatedId = resData;
            return this.series;
          }),
          take(1),
          tap((series) => {
            show.id = generatedId;
            this._series.next(
              series.concat(show)
            );
          })

        );

  }

  addRating(rating: Rating, user: UserData) {
    let generatedId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.http
      .post<{ id: number }>(
        `http://localhost:8080/cineman/rating/add?id=` + user.id,
        rating,
        httpOptions
      ).pipe(
        switchMap((resData) => {
          generatedId = resData;
          return this.ratings;
        }),
        take(1),
        tap((ratings) => {
          rating.id = generatedId;
          this._ratings.next(
            ratings.concat(rating)
          );
        })
      );

  }

  getShow(id: number, user: UserData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<SeriesData>(`http://localhost:8080/cineman/show?id=` + user.id + '&showID=' + id, httpOptions);
      }),
      map((resData) => {
        console.log(resData);
        return new Series(
          resData.id,
          resData.name,
          resData.producer,
          resData.image,
          resData.description,
          resData.year,
          resData.country,
          resData.genre,
          resData.numberOfSeasons,
          resData.averageDuration,
          resData.grade,
          resData.peopleRated
        );
      })
    );

  }

  deleteRating(id: number, user: UserData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .delete(`http://localhost:8080/cineman/rating?id=` + user.id + '&ratingID=' + id, httpOptions);
      }),
      switchMap(() => {
        return this.ratings;
      }),
      take(1),
      tap((ratings) => {
        this._ratings.next(ratings.filter((r) => r.id !== id));
      })
    );
  }

  deleteShow(id: number, user: UserData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .delete(`http://localhost:8080/cineman/show?id=` + user.id + '&showID=' + id, httpOptions);
      }),
      switchMap(() => {
        return this.series;
      }),
      take(1),
      tap((series) => {
        this._series.next(series.filter((s) => s.id !== id));
      })
    );
  }

  editShow(show: Series, user: UserData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': this.makeAToken(user)
      })
    };
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .put(`http://localhost:8080/cineman/show?id=` + user.id,
            show,
            httpOptions
          );
      }),
      switchMap(() => this.series),
      take(1),
      tap((series) => {
        const updatedShowID = series.findIndex((s) => s.id === show.id);
        const updatedSeries = [...series];
        updatedSeries[updatedShowID] = show;
        this._series.next(updatedSeries);
      })
    );

  }
}
