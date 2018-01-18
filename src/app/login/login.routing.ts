import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnauthGuard } from 'ngx-prx-styleguide';
import { LoginComponent } from './login.component';

export const loginRoutes: Routes = [
  { path: 'login',     component: LoginComponent, canActivate: [UnauthGuard] }
];

export const loginRouting: ModuleWithProviders = RouterModule.forRoot(loginRoutes);
