import {Component, Input} from '@angular/core';
import {MapModel} from "../../../models/map.model";
import {NgOptimizedImage} from "@angular/common";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-map-list-item',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './map-list-item.component.html',
  styleUrl: './map-list-item.component.scss'
})
export class MapListItemComponent {
  @Input() public map!: MapModel;
  @Input() public last!: boolean;
  protected readonly environment = environment;
}
