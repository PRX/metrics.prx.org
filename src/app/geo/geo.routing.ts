import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { GeoComponent } from './geo.component';

export const geoRoutes: Routes = [
  {
    path: ':podcastId/demographics',
    pathMatch: 'full',
    redirectTo: ':podcastId/demographics/geocountry/line/daily'
  },
  {
    path: ':podcastId/demographics/:group',
    pathMatch: 'full',
    redirectTo: ':podcastId/demographics/:group/line/daily'
  },
  {
    path: ':podcastId/demographics/:group/:chartType',
    pathMatch: 'full',
    redirectTo: ':podcastId/demographics/:group/:chartType/daily'
  },
  {
    path: ':podcastId/demographics/:group/:chartType/hourly',
    pathMatch: 'full',
    redirectTo: ':podcastId/demographics/:group/:chartType/daily'
  },
  {
    path: ':podcastId/demographics/:group/:chartType/:interval',
    component: GeoComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':podcastId/demographics',
    component: GeoComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  }
];

export const geoRouting: ModuleWithProviders = RouterModule.forChild(geoRoutes);
