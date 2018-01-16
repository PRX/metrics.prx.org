import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { GeoComponent } from './geo.component';
import { NavMenuComponent } from '../shared/nav';

export const geoRoutes: Routes = [
  {
    path: ':seriesId/demographics',
    component: GeoComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    children: [
      { path: '', component: NavMenuComponent, outlet: 'sidenav'}
    ]
  }
];

export const geoRouting: ModuleWithProviders = RouterModule.forChild(geoRoutes);
