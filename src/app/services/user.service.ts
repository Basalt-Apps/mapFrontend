import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MapModel } from '../models/map.model';
import { UserModel } from '../models/user.model';
import { UserLinkModel } from '../models/user-link.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>('/api/users/')
  }

  public getUserLinksByMap(mapId: number): Observable<UserLinkModel> {
    return this.http.get<UserLinkModel>('/api/users/links/' + mapId)
  }
}
