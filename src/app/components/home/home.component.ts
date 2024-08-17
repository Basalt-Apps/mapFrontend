import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { MapModel } from '../../models/map.model';
import { MapDataService } from '../../services/map-data.service';
import { MapListItemComponent } from './map-list-item/map-list-item.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { TokenPayload } from '../../auth/models/token-payload.interface';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MapListItemComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public maps$!: Observable<MapModel[]>;
  public username$!: Observable<string>;
  public admin$!: Observable<boolean>;
  public mapUploader$!: Observable<boolean>;
  public settingsMode = false;
  private delete: [number, number] = [-1, 0];

  constructor(
    private mapDataService: MapDataService,
    private mapService: MapService,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.maps$ = this.mapDataService.getAll();
    const payload = this.authService.getTokenPayload();

    this.username$ = payload.pipe(
      map((payload: TokenPayload | null) => payload?.username ?? ''),
    );
    this.admin$ = payload.pipe(
      map((payload: TokenPayload | null) => payload?.admin ?? false),
    );
    this.mapUploader$ = payload.pipe(
      map((payload: TokenPayload | null) => payload?.mapUploader ?? false),
    );
  }

  public onLogout(): void {
    this.authService.logout();
  }

  public toggleSettingsMode(): void {
    this.settingsMode = !this.settingsMode;
  }

  public onDelete(i: number, mapId: number): void {
    if (i === this.delete[0]) {
      if (++this.delete[1] >= 2) {
        this.onActualDelete(mapId);
        this.delete = [-1, 0];
      }
    } else {
      this.delete[0] = i;
    }
  }

  private onActualDelete(id: number): void {
    this.mapService.delete(id).subscribe();
  }
}
