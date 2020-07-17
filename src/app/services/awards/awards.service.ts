import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { AuthService, UserData } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from 'src/app/model/category.model';
import { Actor } from 'src/app/model/actor.model';
import { Content } from 'src/app/model/content.model';
import { Award } from 'src/app/model/award.model';


export interface AwardDAta {
  id: number;
  name?: string;
  director?: string;
  date: Date;
  country: string;
  description: string;
  image: string;
  category: Category;
  actor: Actor;
  content: Content;
}

export interface CategoryData {
  id: number;
  name: string;
  director: string;
  date: Date;
  country: string;
  description: string;
  image: string;
  category: Category;
  actor: Actor;
  content: Content;
}

@Injectable({
  providedIn: 'root'
})
export class AwardService {
  // tslint:disable-next-line: variable-name
  private _categories = new BehaviorSubject<Category[]>([]);
  // tslint:disable-next-line: variable-name
  private _awards = new BehaviorSubject<Award[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get categories() {
    return this._categories.asObservable();
  }
  get awards() {
    return this._awards.asObservable();
  }

  makeAToken(user: UserData) {
    const tok = user.email + ':' + user.password;
    const hash = btoa(tok);
    return 'Basic ' + hash;
  }

  getAward(id: number, user: UserData) {
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
          .get<AwardDAta>(`http://localhost:8080/cineman/award?id=` + user.id + '&awardID=' + id, httpOptions);
      }),
      map((resData) => {
        console.log(resData);
        return new Award(
          id,
          resData.name,
          resData.director,
          resData.date,
          resData.country,
          resData.description,
          resData.image,
          resData.category,
          resData.actor,
          resData.content
        );
      })
    );

  }

  getAwards(user: UserData) {
    console.log('getAwards service');
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
          .get<{ [id: number]: AwardDAta }>(
            `http://localhost:8080/cineman/award?id=` + user.id
            , httpOptions);
      }),
      map((awardData) => {
        console.log(awardData);
        const awards: Award[] = [];
        for (const key in awardData) {
          if (awardData.hasOwnProperty(key)) {
            awards.push(
              new Award(
                awardData[key].id,
                awardData[key].name,
                awardData[key].director,
                awardData[key].date,
                awardData[key].country,
                awardData[key].description,
                awardData[key].image,
                awardData[key].category,
                awardData[key].actor,
                awardData[key].content
              ));
          }
        }
        return awards;
      }),
      tap(awards => {
        this._awards.next(awards);
      })
    );

  }




  addAward(award: Award, user: UserData) {
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
        `http://localhost:8080/cineman/award/add?id=` + user.id,
        award,
        httpOptions
      ).pipe(
        switchMap((resData) => {
          generatedId = resData;
          return this.awards;
        }),
        take(1),
        tap((awards) => {
          award.id = generatedId;
          this._awards.next(
            awards.concat(award)
          );
        })

      );

  }

  deleteAward(id: number, user: UserData) {
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
          .delete(`http://localhost:8080/cineman/award?id=` + user.id + '&awardID=' + id, httpOptions);
      }),
      switchMap(() => {
        return this.awards;
      }),
      take(1),
      tap((awards) => {
        this._awards.next(awards.filter((a) => a.id !== id));
      })
    );
  }


  editAward(award: Award, user: UserData) {
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
          .put(`http://localhost:8080/cineman/award?id=` + user.id,
            award,
            httpOptions
          );
      }),
      switchMap(() => this.awards),
      take(1),
      tap((awards) => {
        const updatedAwardID = awards.findIndex((a) => a.id === award.id);
        const updatedAwards = [...awards];
        updatedAwards[updatedAwardID] = award;
        this._awards.next(updatedAwards);
      })
    );

  }
}
