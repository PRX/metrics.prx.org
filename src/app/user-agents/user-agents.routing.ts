import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { UserAgentsComponent } from './user-agents.component';
import { NavMenuComponent } from '../shared/nav';

export const userAgentsRoutes: Routes = [
  {
    path: ':seriesId/traffic-sources',
    component: UserAgentsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    children: [
      { path: '', component: NavMenuComponent, outlet: 'sidenav'}
    ]
  }
];

export const userAgentsRouting: ModuleWithProviders = RouterModule.forChild(userAgentsRoutes);
