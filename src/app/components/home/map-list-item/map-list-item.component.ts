import {Component, Input} from '@angular/core';
import {MapModel} from "../../../models/map.model";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { environment } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { map, Observable } from 'rxjs';
import { TokenPayload } from '../../../auth/models/token-payload.interface';

@Component({
  selector: 'app-map-list-item',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    CommonModule
  ],
  templateUrl: './map-list-item.component.html',
  styleUrl: './map-list-item.component.scss'
})
export class MapListItemComponent {
  @Input() public map!: MapModel;
  @Input() public last!: boolean;
  @Input() public settingsMode!: boolean;

  public admin$!: Observable<boolean>

  constructor(private authService: AuthService) {
    this.admin$ = this.authService.getTokenPayload().pipe(map(
      (payload: TokenPayload | null) => payload?.admin ?? false
    ))
  }

  protected readonly environment = environment;
}
