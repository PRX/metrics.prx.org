import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { DownloadsComponent } from './downloads.component';

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
  }
];

export const downloadsRouting: ModuleWithProviders = RouterModule.forChild(downloadsRoutes);
