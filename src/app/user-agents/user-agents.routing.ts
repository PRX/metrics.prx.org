import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { UserAgentsComponent } from './user-agents.component';

export const userAgentsRoutes: Routes = [
  {
    path: ':podcastId/devices',
    pathMatch: 'full',
    redirectTo: ':podcastId/devices/agentos/line/daily'
  },
  {
    path: ':podcastId/devices/:group',
    pathMatch: 'full',
    redirectTo: ':podcastId/devices/:group/line/daily'
  },
  {
    path: ':podcastId/devices/:group/:chartType',
    pathMatch: 'full',
    redirectTo: ':podcastId/devices/:group/:chartType/daily'
  },
  {
    path: ':podcastId/devices/:group/:chartType/hourly',
    pathMatch: 'full',
    redirectTo: ':podcastId/devices/:group/:chartType/daily'
  },
  {
    path: ':podcastId/devices/:group/:chartType/:interval',
    component: UserAgentsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  }
];

export const userAgentsRouting: ModuleWithProviders = RouterModule.forChild(userAgentsRoutes);
