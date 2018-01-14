import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { DownloadsComponent } from './downloads.component';

export const downloadsRoutes: Routes = [
  {
    path: ':seriesId',
    pathMatch: 'full',
    redirectTo: ':seriesId/downloads/podcast/daily'
  },
  {
    path: ':seriesId/downloads',
    pathMatch: 'full',
    redirectTo: ':seriesId/downloads/podcast/daily'
  },
  {
    path: ':seriesId/downloads/:chartType',
    pathMatch: 'full',
    redirectTo: ':seriesId/downloads/podcast/daily'
  },
  {
    path: ':seriesId/downloads/:chartType/:interval',
    component: DownloadsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
  }
];

export const downloadsRouting: ModuleWithProviders = RouterModule.forChild(downloadsRoutes);
