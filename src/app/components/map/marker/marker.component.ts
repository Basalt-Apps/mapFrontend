import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinModel } from '../../../models/pin.model';

@Component({
  selector: 'app-marker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marker.component.html',
  styleUrl: './marker.component.scss'
})
export class MarkerComponent {
  @Input() public pin!: PinModel;
  @Input() public basePinSize!: number;
  @Input() public zoomLevel!: number;

  public clicked = false;
}
