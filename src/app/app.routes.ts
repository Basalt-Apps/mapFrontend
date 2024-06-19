import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NewMapComponent} from "./components/new-map/new-map.component";
import {MapComponent} from "./components/map/map.component";
import {
  LoginFormComponent
} from './auth/components/login-form/login-form.component';
import { authGuard } from './guards/auth.guard';

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
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
