import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MapModel} from "../models/map.model";
import {MapCreateDto} from "../models/create-map.dto";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<MapModel[]> {
    return this.http.get<MapModel[]>('/api/maps')
  }

  public create(body: MapCreateDto): Observable<void> {
    return this.http.post<void>('/api/maps', body)
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>('/api/maps/' + id)
  }
}
