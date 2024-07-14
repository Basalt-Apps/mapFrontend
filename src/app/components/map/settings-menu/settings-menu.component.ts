import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {UserLinkModel} from "../../../models/user-link.model";
import {combineLatestWith, filter, map, Observable, shareReplay, switchMap, take, tap} from "rxjs";
import {CommonModule} from "@angular/common";
import {MapModel} from "../../../models/map.model";

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-menu.component.html',
  styleUrl: './settings-menu.component.scss'
})
export class SettingsMenuComponent implements OnInit {
  @Input() map$!: Observable<MapModel | null>;
  public userLinks$!: Observable<UserLinkModel>
  public checkPending = false;

  constructor(
    private userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.userLinks$ = this.map$.pipe(
      filter((map: MapModel | null): map is MapModel => !!map),
      map((map: MapModel) => map.ID),
      shareReplay(),
      switchMap((mapId: number): Observable<UserLinkModel> =>
        this.userService.getUserLinksByMap(mapId)
      ),
    );

    this.userLinks$.subscribe()
  }

  public userCheckbox(i: number, event: any): void {
    if (this.checkPending) return;
    this.checkPending = true;
    const checked = event.target.checked
    event.target.checked = !checked;
    this.userLinks$.pipe(
      take(1),
      map((userLinks: UserLinkModel): [number, number] =>
        [userLinks.links[i].UserID, userLinks.mapID]
      ),
      switchMap(([userId, mapId]: [number, number]) =>
        this.userService.setUserLink(mapId, userId, checked)
      )
    ).subscribe({
      next: () => {
        event.target.checked = checked
        this.checkPending = false;
      }
    })
  }

  public adminCheckbox(i: number, event: any): void {
    console.log('admin', i, event.target.checked)

  }
}
