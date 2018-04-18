import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, UnauthGuard } from 'ngx-prx-styleguide';
import { LoginComponent } from './login.component';

import { AuthorizationComponent } from '../authorization/authorization.component';

export const loginRoutes: Routes = [
  { path: 'login',     component: LoginComponent, canActivate: [UnauthGuard] },
  { path: 'permission-denied', component: AuthorizationComponent, canActivate: [AuthGuard] }
];

export const loginRouting: ModuleWithProviders = RouterModule.forRoot(loginRoutes);
