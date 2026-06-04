import { Routes } from '@angular/router';
import { SuperHeroComponent } from './components/super-hero/super-hero.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'super-hero',
    component: SuperHeroComponent,
  },
];
