import { Injectable } from '@angular/core';
import { Genre } from 'src/app/model/genre.model';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { AuthService, UserData } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie } from 'src/app/model/movie.model';
import { Rating } from 'src/app/model/rating.model';
import { Category } from 'src/app/model/category.model';
import { Actor } from 'src/app/model/actor.model';
import { Content } from 'src/app/model/content.model';
import { Award } from 'src/app/model/award.model';
import { User } from 'src/app/auth/user.model';

interface GenreData {
  id: number;
  name: string;
}

export interface MovieData {
  id: number;
  name?: string;
  producer?: string;
  image: string;
  description: string;
  year: number;
  genre: Genre;
  country: string;
  budget: number;
  duration: number;
  grade: number;
  peopleRated: number;
}

export interface RatingData {
  id: number;
  user: User;
  content: Content;
  rate: number;
}

export interface CategoryData {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // tslint:disable-next-line: variable-name
  private _genres = new BehaviorSubject<Genre[]>([]);
  // tslint:disable-next-line: variable-name
  private _movies = new BehaviorSubject<Movie[]>([]);
  // tslint:disable-next-line: variable-name
  private _ratings = new BehaviorSubject<Rating[]>([]);
  // tslint:disable-next-line: variable-name
  private _categories = new BehaviorSubject<Category[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get genres() {
    return this._genres.asObservable();
  }

  get movies() {
    return this._movies.asObservable();
  }
  get ratings() {
    return this._ratings.asObservable();
  }
  get categories() {
    return this._categories.asObservable();
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

  getMovies(user: UserData) {
    console.log('getMovies service');
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
          .get<{ [id: number]: MovieData }>(
            `http://localhost:8080/cineman/movie?id=` + user.id
            , httpOptions);
      }),
      map((moviesData) => {
        console.log(moviesData);
        const movies: Movie[] = [];
        for (const id in moviesData) {
          if (moviesData.hasOwnProperty(id)) {
            movies.push(
              new Movie(
                moviesData[id].id,
                moviesData[id].name,
                moviesData[id].producer,
                moviesData[id].image,
                moviesData[id].description,
                moviesData[id].year,
                moviesData[id].country,
                moviesData[id].genre,
                moviesData[id].budget,
                moviesData[id].duration,
                moviesData[id].grade,
                moviesData[id].peopleRated

              ));
          }
        }
        return movies;
      }),
      tap(movies => {
        this._movies.next(movies);
      })
    );

  }

  getCategories(user: UserData) {
    console.log('getCategories service');
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
          .get<{ [id: number]: CategoryData }>(
            `http://localhost:8080/cineman/category?id=` + user.id
            , httpOptions);
      }),
      map((categoryData) => {
        console.log(categoryData);
        const categories: Category[] = [];
        for (const id in categoryData) {
          if (categoryData.hasOwnProperty(id)) {
            categories.push(
              new Category(
                categoryData[id].id,
                categoryData[id].name
              ));
          }
        }
        return categories;
      }),
      tap(categories => {
        this._categories.next(categories);
      })
    );

  }

  addMovie(movie: Movie, user: UserData) {
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
        `http://localhost:8080/cineman/movie/add?id=` + user.id,
        movie,
        httpOptions)
      .pipe(
        switchMap((resData) => {
          generatedId = resData;
          return this.movies;
        }),
        take(1),
        tap((movies) => {
          movie.id = generatedId;
          this._movies.next(
            movies.concat(movie)
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

  getMovie(id: number, user: UserData) {
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
          .get<MovieData>(`http://localhost:8080/cineman/movie?id=` + user.id + '&movieID=' + id, httpOptions);
      }),
      map((resData) => {
        console.log(resData);
        return new Movie(
          id,
          resData.name,
          resData.producer,
          resData.image,
          resData.description,
          resData.year,
          resData.country,
          resData.genre,
          resData.budget,
          resData.duration,
          resData.grade,
          resData.peopleRated
        );
      })
    );

  }

  deleteMovie(id: number, user: UserData) {
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
          .delete(`http://localhost:8080/cineman/movie?id=` + user.id + '&movieID=' + id, httpOptions);
      }),
      switchMap(() => {
        return this.movies;
      }),
      take(1),
      tap((movies) => {
        this._movies.next(movies.filter((m) => m.id !== id));
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

  editMovie(movie: Movie, user: UserData) {
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
          .put(`http://localhost:8080/cineman/movie?id=` + user.id,
            movie,
            httpOptions
          );
      }),
      switchMap(() => this.movies),
      take(1),
      tap((movies) => {
        const updatedMovieID = movies.findIndex((m) => m.id === movie.id);
        const updatedMovies = [...movies];
        updatedMovies[updatedMovieID] = movie;
        this._movies.next(updatedMovies);
      })
    );

  }
}
