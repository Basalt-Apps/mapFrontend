import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { LoginDTO } from '../models/login.dto';
import { TokenPayload } from '../models/token-payload.interface';
import { Router } from '@angular/router';
import { AuthHttpService } from './auth-http.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token$ = new BehaviorSubject<string | null>(null);
  private tokenPayload$ = new BehaviorSubject<TokenPayload | null>(null);
  private userID$: Observable<number>;
  private loggedIn = false;

  constructor(
    private router: Router,
    private authHttpService: AuthHttpService,
    private tokenService: TokenService,
  ) {
    this.token$.subscribe((token: string | null) =>
      this.tokenService.setToken(token),
    );
    this.userID$ = this.tokenPayload$.pipe(
      map((payload: TokenPayload | null) => payload?.userID ?? -1),
    );

    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.token$.next(token);
    this.tokenPayload$.next(
      JSON.parse(window.atob(token.split('.')[1])) as TokenPayload,
    );
    this.loggedIn = true;
    this.verify();
  }

  public login(body: LoginDTO): Observable<string> {
    return this.authHttpService.login(body).pipe(
      take(1),
      tap((token: string) => {
        this.token$.next(token);
        this.tokenPayload$.next(
          JSON.parse(window.atob(token.split('.')[1])) as TokenPayload,
        );
        this.loggedIn = true;
        localStorage.setItem('authToken', token);
      }),
    );
  }

  public verify(): void {
    const handle = (valid: boolean): void => {
      if (valid) return void (this.loggedIn = true);
      this.loggedIn = false;
      this.token$.next(null);
      this.tokenPayload$.next(null);
      localStorage.removeItem('authToken');
      void this.router.navigate(['/', 'login']);
    };

    if (this.token$.value === null) handle(false);

    this.token$
      .pipe(
        take(1),
        switchMap(
          (token: string | null): Observable<boolean> =>
            token
              ? this.authHttpService.verify(token)
              : of((this.loggedIn = false)),
        ),
        take(1),
      )
      .subscribe({
        next: handle,
        error: (err: HttpErrorResponse) => console.error(err),
      });
  }

  public getLoggedIn(): boolean {
    return this.loggedIn;
  }

  public logout(): void {
    this.token$.next(null);
    this.tokenPayload$.next(null);
    this.loggedIn = false;
    void this.router.navigate(['/', 'login']);
    localStorage.removeItem('authToken');
  }

  public getTokenPayload(): Observable<TokenPayload | null> {
    return this.tokenPayload$.asObservable();
  }

  public getUserID(): Observable<number> {
    return this.userID$;
  }
}
