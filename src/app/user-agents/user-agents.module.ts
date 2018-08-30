import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { UserAgentsComponent } from './user-agents.component';
import { UserAgentsChartComponent } from './user-agents-chart.component';

import { userAgentsRouting } from './user-agents.routing';

@NgModule({
  declarations: [
    UserAgentsComponent,
    UserAgentsChartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    userAgentsRouting
  ]
})

export class UserAgentsModule { }
