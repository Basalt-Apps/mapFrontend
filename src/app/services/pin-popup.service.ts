import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PinPopupService {
  private clicked$ = new BehaviorSubject<number>(-1);

  public unset(): void {
    this.clicked$.next(-1);
  }

  public getClicked(id: number): Observable<boolean> {
    return this.clicked$
      .asObservable()
      .pipe(map((selected: number) => selected === id));
  }

  public getIfSet(): Observable<boolean> {
    return this.clicked$
      .asObservable()
      .pipe(map((selected: number) => selected !== -1));
  }

  public setClicked(id: number): void {
    this.clicked$.next(id);
  }
}
