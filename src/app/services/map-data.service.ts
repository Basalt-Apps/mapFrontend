import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MapService } from './map.service';
import { SignalService } from './signal.service';
import { MapModel } from '../models/map.model';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  private maps$ = new BehaviorSubject<ReadonlyMap<number, MapModel>>(new Map());

  private ids$ = new BehaviorSubject<number[]>([]);

  constructor(
    private mapService: MapService,
    private signalService: SignalService,
    private authService: AuthService,
  ) {
    this.load();
    this.signalService.getSocket()?.on('map', () => this.load());
  }

  public getAll(): Observable<MapModel[]> {
    return combineLatest([this.ids$, this.maps$]).pipe(
      map(
        ([ids, maps]: [number[], ReadonlyMap<number, MapModel>]): MapModel[] =>
          ids
            .map((id: number): MapModel | undefined => maps.get(id))
            .filter((map?: MapModel): map is MapModel => !!map),
      ),
    );
  }

  public getById(id: number): Observable<MapModel | null> {
    return this.maps$.pipe(
      map((map: ReadonlyMap<number, MapModel>) => map.get(id) ?? null),
    );
  }

  public clear(): void {
    this.ids$.next([]);
    this.maps$.next(new Map<number, MapModel>());
  }

  private load(): void {
    this.mapService.getAll().subscribe({
      next: (maps: MapModel[]) => {
        const ids = [];
        const mapMap = new Map<number, MapModel>();

        for (const map of maps) {
          ids.push(map.ID);
          mapMap.set(map.ID, map);
        }

        this.update(ids, mapMap);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.Unauthorized) {
          this.authService.logout();
        }
      },
    });
  }

  private update(ids: number[], mapMap: Map<number, MapModel>): void {
    this.ids$.next(ids);
    this.maps$.next(mapMap);
  }
}
