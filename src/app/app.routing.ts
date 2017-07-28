import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, UnauthGuard } from 'ngx-prx-styleguide';
import { HomeComponent } from './home';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '',          component: HomeComponent,  canActivate: [AuthGuard] },
  { path: 'login',     component: LoginComponent, canActivate: [UnauthGuard] }
];

export const routingComponents: any[] = [
  HomeComponent,
  LoginComponent
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
