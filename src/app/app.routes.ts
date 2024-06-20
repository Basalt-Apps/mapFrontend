import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NewMapComponent} from "./components/new-map/new-map.component";
import {MapComponent} from "./components/map/map.component";
import {
  LoginFormComponent
} from './auth/components/login-form/login-form.component';
import { authGuard } from './guards/auth.guard';
import { HelpComponent } from './components/help/help.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'map/new',
    component: NewMapComponent,
    canActivate: [authGuard]
  },
  {
    path: 'map/:id',
    component: MapComponent,
    canActivate: [authGuard]
  },
  {
    path: 'help',
    component: HelpComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [loginGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
