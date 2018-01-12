import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'ngx-prx-styleguide';

import { UserAgentsComponent } from './user-agents.component';

export const userAgentsRoutes: Routes = [
  {
    path: ':seriesId/traffic-sources',
    component: UserAgentsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
  }
];

export const userAgentsRouting: ModuleWithProviders = RouterModule.forChild(userAgentsRoutes);
