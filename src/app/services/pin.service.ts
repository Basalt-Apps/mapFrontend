import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PinModel} from "../models/pin.model";
import {PinCreateDto} from "../models/pin-create.dto";

@Injectable({
  providedIn: 'root'
})
export class PinService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<PinModel[]> {
    return this.http.get<PinModel[]>('/api/pins/')
  }

  public createNew(body: PinCreateDto): Observable<void> {
    return this.http.post<void>('/api/pins/', body)
  }
}
