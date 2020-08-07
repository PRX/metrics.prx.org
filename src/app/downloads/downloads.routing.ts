import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { DownloadsComponent } from './downloads.component';
import { DropdayComponent } from './dropday.component';
import { ListenersComponent } from './listeners.component';

export const downloadsRoutes: Routes = [
  {
    path: ':podcastId',
    pathMatch: 'full',
    redirectTo: ':podcastId/reach/podcast/daily'
  },
  {
    path: ':podcastId/reach',
    pathMatch: 'full',
    redirectTo: ':podcastId/reach/podcast/daily'
  },
  {
    path: ':podcastId/reach/:chartType',
    pathMatch: 'full',
    redirectTo: ':podcastId/reach/podcast/daily'
  },
  {
    path: ':podcastId/reach/:chartType/:interval',
    component: DownloadsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':podcastId/dropday',
    pathMatch: 'full',
    redirectTo: ':podcastId/dropday/episodes/daily'
  },
  {
    path: ':podcastId/dropday/:chartType',
    pathMatch: 'full',
    redirectTo: ':podcastId/dropday/episodes/daily'
  },
  {
    path: ':podcastId/dropday/:chartType/:interval',
    component: DropdayComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':podcastId/listeners',
    pathMatch: 'full',
    redirectTo: ':podcastId/listeners/line/last_week'
  },
  {
    path: ':podcastId/listeners/:chartType',
    pathMatch: 'full',
    redirectTo: ':podcastId/listeners/:chartType/last_week'
  },
  {
    path: ':podcastId/listeners/:chartType/:interval',
    component: ListenersComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  }
];

export const downloadsRouting: ModuleWithProviders = RouterModule.forChild(downloadsRoutes);
