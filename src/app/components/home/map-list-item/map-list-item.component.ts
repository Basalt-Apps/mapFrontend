import { Component, Input, OnInit } from '@angular/core';
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
export class MapListItemComponent implements OnInit {
  @Input() public map!: MapModel;
  @Input() public last!: boolean;
  @Input() public settingsMode!: boolean;

  public admin$!: Observable<boolean>
  public userID$!: Observable<any>

  constructor(private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.admin$ = this.authService.getTokenPayload().pipe(map(
      (payload: TokenPayload | null) => payload?.admin ?? false
    ))
    this.userID$ = this.authService.getUserID();
  }



  protected readonly environment = environment;
}
