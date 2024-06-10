import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, tap} from "rxjs";
import {MapService} from "./map.service";
import {SignalService} from "./signal.service";
import {MapModel} from "../models/map.model";

@Injectable({
  providedIn: 'root'
})
export class MapDataService {
  private maps$ = new BehaviorSubject<ReadonlyMap<number, MapModel>>(
    new Map()
  )

  private ids$ = new BehaviorSubject<number[]>([]);

  constructor(private mapService: MapService, private signalService: SignalService) {
    this.load()
    this.signalService.getSocket()?.on('map', () => this.load())
  }

  public getAll(): Observable<MapModel[]> {
    return combineLatest([this.ids$, this.maps$]).pipe(
      map(([ids, maps]: [number[], ReadonlyMap<number, MapModel>]): MapModel[] =>
        ids.map((id: number): MapModel | undefined => maps.get(id))
          .filter((map?: MapModel): map is MapModel => !!map)
      )
    )
  }

  public getById(id: number): Observable<MapModel | null> {
    return this.maps$.pipe(
      map((map: ReadonlyMap<number, MapModel>) => map.get(id) ?? null),
    )
  }

  private load() {
    this.mapService
      .getAll()
      .subscribe((maps: MapModel[]) => {
        const ids = [];
        const mapMap = new Map<number, MapModel>();

        for (const map of maps) {
          ids.push(map.ID);
          mapMap.set(map.ID, map);
        }

        this.update(ids, mapMap)
      })
  }

  private update(ids: number[], mapMap: Map<number, MapModel>) {
    this.ids$.next(ids);
    this.maps$.next(mapMap)
  }
}
