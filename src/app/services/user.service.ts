import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import {UserLinkModel} from '../models/user-link.model';

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

  public setUserLink(mapId: number, userId: number, status: boolean): Observable<void> {
    return this[status ? 'addUserLink' : 'removeUserLink'](mapId, userId);
  }

  private addUserLink(mapId: number, userId: number): Observable<void> {
    return this.http.post<void>('/api/users/links/add', { mapId, userId })
  }

  private removeUserLink(mapId: number, userId: number): Observable<void> {
    return this.http.post<void>('/api/users/links/remove', { mapId, userId })
  }

  public setUserLinkAdmin(mapId: number, userId: number, status: boolean): Observable<void> {
    return this[status ? 'addUserLinkAdmin' : 'removeUserLinkAdmin'](mapId, userId);
  }

  private addUserLinkAdmin(mapId: number, userId: number): Observable<void> {
    return this.http.post<void>('/api/users/links/addAdmin', { mapId, userId })
  }

  private removeUserLinkAdmin(mapId: number, userId: number): Observable<void> {
    return this.http.post<void>('/api/users/links/removeAdmin', { mapId, userId })
  }
}
