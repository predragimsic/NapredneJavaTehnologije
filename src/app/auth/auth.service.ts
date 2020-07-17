/* tslint:disable:variable-name */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';

export interface AuthResponseData {
    id: number;
    token: string;
    email: string;
    password: string,
    name: string;
    surname: string;
}

export interface UserData {
    name?: string;
    surname?: string;
    email: string;
    password: string;
    id: number;
    _token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isUserAuthenticated = false;
    private _user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) {
    }

    get isUserAuthenticated() {
        return this._user.asObservable().pipe(
            map((user) => {
                if (user) {
                    return !!user._token;
                } else {
                    return false;
                }
            })
        );
    }

    get userId() {
        return this._user.asObservable().pipe(
            map((user) => {
                if (user) {
                    return user.id;
                } else {
                    return null;
                }
            })
        );
    }

    get token() {
        return this._user.asObservable().pipe(
            map((user) => {
                if (user) {
                    return user._token;
                } else {
                    return null;
                }
            })
        );
    }

    logIn(user: UserData) {
        this._isUserAuthenticated = true;
        console.log(user.email);
        console.log(user.password);
        console.log(user.name);
        console.log(user.surname);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                // tslint:disable-next-line: object-literal-key-quotes
                'Authorization': this.makeAToken(user)
            })
        };
        return this.http.post<AuthResponseData>(`http://localhost:8080/cineman/user/login`,
            {}, httpOptions)
            .pipe(tap(userData => {
                const newUser = new User(userData.id, userData.email, userData.password, userData.token, userData.name, userData.surname);
                console.log(newUser);
                this._user.next(newUser);
                localStorage.setItem('currentUser', JSON.stringify(newUser));
            }));
    }
    makeAToken(user: UserData) {
        const tok = user.email + ':' + user.password;
        const hash = btoa(tok);
        return 'Basic ' + hash;
    }
    logOut(user: UserData) {
        console.log(user.id);
        console.log('logged out');
        this._user.next(null);
        localStorage.removeItem('currentUser');
        const urlForReq = `http://localhost:8080/cineman/user/logout?id=` + user.id;
        console.log(urlForReq);
        return this.http.get(urlForReq)
        .subscribe((res) => {
            console.log(res);
        });

    }

    register(user: UserData) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                // tslint:disable-next-line: object-literal-key-quotes
                'Authorization': this.makeAToken(user)
            })
        };
        this._isUserAuthenticated = true;
        const identity = new User(-1, user.email, user.password, null, user.name, user.surname);
        console.log(identity);
        return this.http.post<AuthResponseData>(`http://localhost:8080/cineman/user/register`, {
            name: user.name,
            surname: user.surname
        }, httpOptions).pipe(tap(userData => {
            const newU = new User(userData.id, userData.email, user.password, userData.token, userData.name, userData.surname);
            console.log(newU);
            this._user.next(newU);
        }));
    }
}
