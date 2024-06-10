import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {NewMapComponent} from "./components/new-map/new-map.component";
import {MapComponent} from "./components/map/map.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'map/new',
    component: NewMapComponent
  },
  {
    path: 'map/:id',
    component: MapComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
