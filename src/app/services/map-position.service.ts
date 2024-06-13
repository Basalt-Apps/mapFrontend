import { Injectable } from '@angular/core';
import { MapUpdate } from '../models/map-update.interface';

@Injectable({
  providedIn: 'root'
})
export class MapPositionService {
  private mapComponentUpdateCallback?: (data: MapUpdate) => void

  constructor() { }

  public sendUpdate(data: MapUpdate): void {
    this.mapComponentUpdateCallback?.(data);
  }

  public setCallback(fn: (data: MapUpdate) => void): void {
    this.mapComponentUpdateCallback = fn;
  }
}
