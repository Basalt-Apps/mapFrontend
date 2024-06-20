import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { UserDataService } from '../../../services/user-data.service';
import { UserService } from '../../../services/user.service';
import { SignalService } from '../../../services/signal.service';
import { UserLinkModel } from '../../../models/user-link.model';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [],
  templateUrl: './settings-menu.component.html',
  styleUrl: './settings-menu.component.scss'
})
export class SettingsMenuComponent implements OnInit {
  // @Input() mapId!: number;
  // public userLinks$!: Observable<UserLinkModel>

  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private signalService: SignalService
  ) {
  }

  public ngOnInit(): void {
    // if (this.mapId == -1) return;
    // this.userLinks$ = this.userService.getUserLinksByMap(this.mapId);
  }
}
