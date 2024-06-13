import {
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChanges } from '../../../models/ng-changes.type';
import { OmitPinPos } from '../../../models/omit-pin-pos.type';
import { V2 } from '../../../models/V2.class';
import { Observable, switchMap, take } from 'rxjs';
import { MapPositionService } from '../../../services/map-position.service';

@Component({
  selector: 'app-marker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marker.component.html',
  styleUrl: './marker.component.scss'
})
export class MarkerComponent implements OnChanges {
  @Input() public pin!: OmitPinPos;
  @Input() public pos$!: Observable<V2>;
  @Input() public basePinSize!: number;
  @Input() public zoomLevel!: number;
  @Input() public mapImg!: HTMLImageElement
  @Input() public mapPos!: V2

  public clicked = false;
  public pinSize = this.basePinSize * this.zoomLevel / 100

  constructor(public mapPositionService: MapPositionService) {
  }

  public ngOnChanges(changes: NgChanges<MarkerComponent>): void {
    if (changes.basePinSize || changes.zoomLevel) {
      this.pinSize = (changes.basePinSize?.currentValue ?? this.basePinSize)
        * (changes.zoomLevel?.currentValue ?? this.zoomLevel) / 100
    }
  }

  public onClick(): void {
    this.pos$.pipe(
      take(1),
      switchMap((pos: V2): Observable<V2> => {
        this.mapPositionService.sendUpdate({
          zoomLevel: this.zoomLevel,
          mapPos: this.inverseTransformPos(pos, this.mapImg, this.zoomLevel, this.mapPos)
        })
        return this.pos$.pipe(take(1))
      }
    )).subscribe((pos: V2) => setTimeout(() => {
      this.mapPositionService.sendUpdate({
        mapPos: this.inverseTransformPos(pos, this.mapImg, this.zoomLevel, this.mapPos).subtract(pos)
      })
    }, 30))
  }

  private inverseTransformPos(pos: V2, mapImg: HTMLImageElement, zoomLevel: number, mapPos: V2): V2 {
    return (
      pos.add(
        new V2(1,1)
          .multiply(this.basePinSize * zoomLevel / 100)
          .hadamardDivision(new V2(2, 1.1))
          .subtract(mapPos)
      ).hadamardDivision(new V2(mapImg))
    )
  }
}
