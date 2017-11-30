import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { DownloadsComponent } from './downloads.component';
import { INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../ngrx/model';

export const downloadsRoutes: Routes = [
  {
    path: `:seriesId/downloads/${INTERVAL_MONTHLY.key}`,
    component: DownloadsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
  },
  {
    path: `:seriesId/downloads/${INTERVAL_WEEKLY.key}`,
    component: DownloadsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  },
  {
    path: `:seriesId/downloads/${INTERVAL_DAILY.key}`,
    component: DownloadsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  },
  {
    path: `:seriesId/downloads/${INTERVAL_HOURLY.key}`,
    component: DownloadsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  }
];

export const downloadsRouting: ModuleWithProviders = RouterModule.forChild(downloadsRoutes);
