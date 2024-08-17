import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginDTO } from '../models/login.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  constructor(private http: HttpClient) {}

  public login(body: LoginDTO): Observable<string> {
    return this.http.post('/auth/login', body, { responseType: 'text' });
  }

  public verify(token: string): Observable<boolean> {
    return this.http.post<boolean>('/auth/verify', { token });
  }
}
