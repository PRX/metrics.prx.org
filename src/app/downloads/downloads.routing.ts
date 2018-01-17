import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { DownloadsComponent } from './downloads.component';
import { NavMenuComponent } from '../shared/nav';

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
    children: [
      { path: '', component: NavMenuComponent, outlet: 'sidenav'}
    ]
  }
];

export const downloadsRouting: ModuleWithProviders = RouterModule.forChild(downloadsRoutes);
