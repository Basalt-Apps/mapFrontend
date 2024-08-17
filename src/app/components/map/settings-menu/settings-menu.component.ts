import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserLinkModel } from '../../../models/user-link.model';
import { filter, map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MapModel } from '../../../models/map.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-menu.component.html',
  styleUrl: './settings-menu.component.scss',
})
export class SettingsMenuComponent implements OnInit {
  @Input() map$!: Observable<MapModel | null>;
  public userLinks$!: Observable<UserLinkModel>;
  public checkPending = false;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
  ) {}

  public ngOnInit(): void {
    this.userLinks$ = this.map$.pipe(
      filter((map: MapModel | null): map is MapModel => !!map),
      map((map: MapModel) => map.ID),
      shareReplay(),
      switchMap(
        (mapId: number): Observable<UserLinkModel> =>
          this.userService.getUserLinksByMap(mapId),
      ),
    );

    this.userLinks$.subscribe();
  }

  public userCheckbox(i: number, event: Event): void {
    if (this.checkPending) return;
    this.checkPending = true;
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    target.checked = !checked;
    this.userLinks$
      .pipe(
        take(1),
        map((userLinks: UserLinkModel): [number, number] => [
          userLinks.links[i].UserID,
          userLinks.mapID,
        ]),
        switchMap(([userId, mapId]: [number, number]) =>
          this.userService.setUserLink(mapId, userId, checked),
        ),
      )
      .subscribe({
        next: () => {
          target.checked = checked;
          this.checkPending = false;
        },
        error: (error: HttpErrorResponse) => {
          this.checkPending = false;
          this.errorService.setErrorHttp(error);
        },
      });
  }

  public adminCheckbox(i: number, event: Event): void {
    if (this.checkPending) return;
    this.checkPending = true;
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    target.checked = !checked;
    this.userLinks$
      .pipe(
        take(1),
        map((userLinks: UserLinkModel): [number, number, boolean] => [
          userLinks.links[i].UserID,
          userLinks.mapID,
          userLinks.links[i].Selected,
        ]),
        filter(([, , predicate]: [number, number, boolean]) =>
          predicate ? true : (this.checkPending = false),
        ),
        switchMap(([userId, mapId]: [number, number, boolean]) =>
          this.userService.setUserLinkAdmin(mapId, userId, checked),
        ),
      )
      .subscribe({
        next: () => {
          target.checked = checked;
          this.checkPending = false;
        },
        error: (error: HttpErrorResponse) => {
          this.checkPending = false;
          this.errorService.setErrorHttp(error);
        },
      });
  }
}
