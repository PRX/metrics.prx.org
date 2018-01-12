import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';
import { DownloadsTableComponent } from './downloads-table.component';

import { downloadsRouting } from './downloads.routing';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartComponent,
    DownloadsTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FancyFormModule,
    downloadsRouting
  ]
})

export class DownloadsModule { }
