import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token$ = new BehaviorSubject<string | null>(null);

  public setToken(token: string | null): void {
    this.token$.next(token)
  }

  public getToken(): Observable<string | null> {
    return this.token$.asObservable();
  }
}
