import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { map, Observable } from "rxjs";
import {PinModel} from "../models/pin.model";
import {PinCreateDto} from "../models/pin-create.dto";
import { V2 } from '../models/V2.class';

@Injectable({
  providedIn: 'root'
})
export class PinService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<PinModel[]> {
    return this.http.get<PinModel[]>('/api/pins/').pipe(map(this.convertV2))
  }

  public createNew(body: PinCreateDto): Observable<void> {
    return this.http.post<void>('/api/pins/', body)
  }

  public deleteById(id: number): Observable<void> {
    return this.http.delete<void>('/api/pins/' + id)
  }

  private convertV2(pins: PinModel[]): PinModel[] {
    return pins.map((pin: PinModel): PinModel => ({
      Name: pin.Name,
      Pos: new V2(pin.Pos.x, pin.Pos.y),
      MapID: pin.MapID,
      Content: pin.Content,
      ID: pin.ID
    }))
  }
}
