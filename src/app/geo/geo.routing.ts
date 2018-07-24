import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { GeoComponent } from './geo.component';

export const geoRoutes: Routes = [
  {
    path: ':seriesId/:podcastId/demographics',
    component: GeoComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard]
  }
];

export const geoRouting: ModuleWithProviders = RouterModule.forChild(geoRoutes);
