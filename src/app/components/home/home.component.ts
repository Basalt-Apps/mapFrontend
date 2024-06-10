import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Observable} from "rxjs";
import {MapModel} from "../../models/map.model";
import {MapService} from "../../services/map.service";
import {MapDataService} from "../../services/map-data.service";
import {MapListItemComponent} from "./map-list-item/map-list-item.component";
import {RouterLink} from "@angular/router";

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

  constructor(private mapService: MapDataService) {
  }

  public ngOnInit(): void {
    this.maps$ = this.mapService.getAll();
  }
}
