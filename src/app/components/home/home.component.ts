import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import { map, Observable } from "rxjs";
import {MapModel} from "../../models/map.model";
import {MapDataService} from "../../services/map-data.service";
import {MapListItemComponent} from "./map-list-item/map-list-item.component";
import {RouterLink} from "@angular/router";
import { AuthService } from '../../auth/services/auth.service';
import { TokenPayload } from '../../auth/models/token-payload.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MapListItemComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public maps$!: Observable<MapModel[]>;
  public username$!: Observable<string>
  public admin$!: Observable<boolean>
  public settingsMode = false;

  constructor(
    private mapService: MapDataService,
    private authService: AuthService
  ) {
  }

  public ngOnInit(): void {
    this.maps$ = this.mapService.getAll();
    const payload = this.authService.getTokenPayload();

    this.username$ = payload.pipe(map(
      (payload: TokenPayload | null) => payload?.username ?? ''
    ))
  }

  public onLogout(): void {
    this.authService.logout()
  }

  public toggleSettingsMode(): void {
    this.settingsMode = !this.settingsMode;
  }
}
