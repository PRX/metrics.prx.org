import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { DownloadsComponent } from './downloads.component';

export const downloadsRoutes: Routes = [
  {
    path: ':seriesId/:podcastId',
    pathMatch: 'full',
    redirectTo: ':seriesId/:podcastId/reach/podcast/daily'
  },
  {
    path: ':seriesId/:podcastId/reach',
    pathMatch: 'full',
    redirectTo: ':seriesId/:podcastId/reach/podcast/daily'
  },
  {
    path: ':seriesId/:podcastId/reach/:chartType',
    pathMatch: 'full',
    redirectTo: ':seriesId/:podcastId/reach/podcast/daily'
  },
  {
    path: ':seriesId/:podcastId/reach/:chartType/:interval',
    component: DownloadsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  }
];

export const downloadsRouting: ModuleWithProviders = RouterModule.forChild(downloadsRoutes);
