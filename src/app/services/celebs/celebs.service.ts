import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { AuthService, UserData } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Actor } from 'src/app/model/actor.model';
import { Role } from 'src/app/model/role.model';
import { Genre } from 'src/app/model/genre.model';
import { Movie } from 'src/app/model/movie.model';

export interface ActorData {
  id: number;
  name: string;
  aka: string;
  biography: string;
  dateOfBirth: Date;
  country: string;
  height: number;
  image: string;
  roles: Role[];
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

@Injectable({
  providedIn: 'root'
})
export class CelebService {
  // tslint:disable-next-line: variable-name
  private _actors = new BehaviorSubject<Actor[]>([]);
  // tslint:disable-next-line: variable-name
  private _movies = new BehaviorSubject<Movie[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get actors() {
    return this._actors.asObservable();
  }
  get movies() {
    return this._movies.asObservable();
  }
  makeAToken(user: UserData) {
    const tok = user.email + ':' + user.password;
    const hash = btoa(tok);
    return 'Basic ' + hash;
  }
  getActors(user: UserData) {
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
          .get<{ [id: number]: ActorData }>(
            `http://localhost:8080/cineman/actor?id=` + user.id
            , httpOptions);
      }),
      map((response) => {
        console.log(response);
        const actors: Actor[] = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            actors.push(
              new Actor(
                response[key].id,
                response[key].name,
                response[key].aka,
                response[key].biography,
                response[key].dateOfBirth,
                response[key].country,
                response[key].height,
                response[key].image,
                response[key].roles
              ));
          }
        }
        return actors;
      }),
      tap(actors => {
        this._actors.next(actors);
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

  addActor(actor: Actor, user: UserData) {
    console.log(JSON.stringify(actor));
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
      `http://localhost:8080/cineman/actor/add?id=` + user.id,
      actor,
      httpOptions
      ).pipe(
        switchMap((resData) => {
          generatedId = resData;
          return this.actors;
        }),
        take(1),
        tap((actors) => {
          actor.id = generatedId;
          this._actors.next(
            actors.concat(actor)
          );
        })
      );

  }

  getActor(id: number, user: UserData) {
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
          .get<ActorData>(`http://localhost:8080/cineman/actor?id=` + user.id + '&actorID=' + id, httpOptions);
      }),
      map((resData) => {
        console.log(resData);
        return new Actor(
          id,
          resData.name,
          resData.aka,
          resData.biography,
          resData.dateOfBirth,
          resData.country,
          resData.height,
          resData.image,
          resData.roles
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

  deleteActor(id: number, user: UserData) {
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
          .delete(`http://localhost:8080/cineman/actor?id=` + user.id + '&actorID=' + id, httpOptions);
      }),
      switchMap(() => {
        return this.actors;
      }),
      take(1),
      tap((actors) => {
        this._actors.next(actors.filter((a) => a.id !== id));
      })
    );
  }

  editActor(actor: Actor, user: UserData) {
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
          .put(`http://localhost:8080/cineman/actor?id=` + user.id,
          actor,
          httpOptions
          );
      }),
      switchMap(() => this.actors),
      take(1),
      tap((actors) => {
        const updatedActorID = actors.findIndex((m) => m.id === actor.id);
        const updatedActors = [...actors];
        updatedActors[updatedActorID] = actor;
        this._actors.next(updatedActors);
      })
    );

  }
}
