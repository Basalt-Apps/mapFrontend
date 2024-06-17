import {
  Component, EventEmitter,
  Input,
  OnChanges, OnInit, Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChanges } from '../../../models/ng-changes.type';
import { OmitPinPos } from '../../../models/omit-pin-pos.type';
import { V2 } from '../../../models/V2.class';
import { Observable, tap } from 'rxjs';
import { PinPopupService } from '../../../services/pin-popup.service';
import { PinService } from '../../../services/pin.service';
import { PopupComponent } from '../../popup/popup.component';

@Component({
  selector: 'app-marker',
  standalone: true,
  imports: [CommonModule, PopupComponent],
  templateUrl: './marker.component.html',
  styleUrl: './marker.component.scss'
})
export class MarkerComponent implements OnInit, OnChanges {
  @Input() public pin!: OmitPinPos;
  @Input() public pos$!: Observable<V2>;
  @Input() public basePinSize!: number;
  @Input() public zoomLevel!: number;
  @Input() public mapImg!: HTMLImageElement
  @Input() public mapPos!: V2

  @Output() clicked = new EventEmitter<void>();

  public clicked$!: Observable<boolean>;
  public pinSize = this.basePinSize * this.zoomLevel / 100

  private deleting = 0;

  constructor(
    private pinPopupService: PinPopupService,
    private pinService: PinService
  ) {
  }

  public ngOnInit(): void {
    this.clicked$ = this.pinPopupService.getClicked(this.pin.ID)
      .pipe(tap((selected: boolean) => selected && (this.deleting = 0)))
  }

  public ngOnChanges(changes: NgChanges<MarkerComponent>): void {
    if (changes.basePinSize || changes.zoomLevel) {
      this.pinSize = (changes.basePinSize?.currentValue ?? this.basePinSize)
        * (changes.zoomLevel?.currentValue ?? this.zoomLevel) / 100
    }
  }

  public onClick(): void {
    this.clicked.emit()
    this.pinPopupService.setClicked(this.pin.ID);
  }

  public onDeleteButton(): void {
    if (++this.deleting >= 3) this.pinService.deleteById(this.pin.ID).subscribe()
  }

  public onClosePopup(): void {
    this.pinPopupService.unset()
  }
}
