import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'ngx-prx-styleguide';
import { HomeComponent } from './home';

export const routes: Routes = [
  { path: '', component: HomeComponent,  canActivate: [AuthGuard] }
];

export const routingComponents: any[] = [
  HomeComponent
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
