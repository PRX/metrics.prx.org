import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartContainerComponent } from './downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';
import { DownloadsTableContainerComponent } from './downloads-table-container.component';
import { DownloadsTablePresentationComponent } from './downloads-table-presentation.component';
import { ScrollingTableComponent } from './table/scrolling-table.component';

import { downloadsRouting } from './downloads.routing';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartContainerComponent,
    DownloadsChartPresentationComponent,
    DownloadsTableContainerComponent,
    DownloadsTablePresentationComponent,
    ScrollingTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FancyFormModule,
    downloadsRouting
  ]
})

export class DownloadsModule { }
