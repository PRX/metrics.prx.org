import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartContainerComponent } from './downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';
import { DownloadsTableComponent } from './downloads-table.component';

import { downloadsRouting } from './downloads.routing';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartContainerComponent,
    DownloadsChartPresentationComponent,
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
