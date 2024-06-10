import {BehaviorSubject, combineLatest, Observable, map} from "rxjs";
import {SignalService} from "./signal.service";
import {Injectable} from '@angular/core';
import {PinModel} from "../models/pin.model";
import {PinService} from "./pin.service";

@Injectable({
  providedIn: 'root'
})
export class PinDataService {
  private pins$ = new BehaviorSubject<ReadonlyMap<number, PinModel>>(
    new Map()
  )

  private ids$ = new BehaviorSubject<number[]>([]);

  constructor(private pinService: PinService, private signalService: SignalService) {
    this.load()
    this.signalService.getSocket()?.on('pin', () => this.load())
  }

  public getAll(): Observable<PinModel[]> {
    return combineLatest([this.ids$, this.pins$]).pipe(
      map(([ids, pins]: [number[], ReadonlyMap<number, PinModel>]): PinModel[] =>
        ids.map((id: number): PinModel | undefined => pins.get(id))
          .filter((pin?: PinModel): pin is PinModel => !!pin)
      )
    )
  }

  public getById(id: number): Observable<PinModel | null> {
    return this.pins$.pipe(
      map((pin: ReadonlyMap<number, PinModel>) => pin.get(id) ?? null),
    )
  }

  private load() {
    this.pinService
      .getAll()
      .subscribe((pins: PinModel[]) => {
        const ids = [];
        const pinMap = new Map<number, PinModel>();

        for (const pin of pins) {
          ids.push(pin.ID);
          pinMap.set(pin.ID, pin);
        }

        this.update(ids, pinMap)
      })
  }

  private update(ids: number[], pinMap: Map<number, PinModel>) {
    this.ids$.next(ids);
    this.pins$.next(pinMap)
  }
}
