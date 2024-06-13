import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinModel } from '../../../models/pin.model';
import { NgChanges } from '../../../models/ng-changes.type';
import { OmitPinPos } from '../../../models/omit-pin-pos.type';
import { V2 } from '../../../models/V2.class';
import { Observable } from 'rxjs';

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

  public clicked = false;
  public pinSize = this.basePinSize * this.zoomLevel / 100

  public ngOnChanges(changes: NgChanges<MarkerComponent>): void {
    if (changes.basePinSize || changes.zoomLevel) {
      this.pinSize = (changes.basePinSize?.currentValue ?? this.basePinSize)
        * (changes.zoomLevel?.currentValue ?? this.zoomLevel) / 100
    }
  }
}
