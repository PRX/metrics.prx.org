import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartContainerComponent } from './chart/downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './chart/downloads-chart-presentation.component';
import { DownloadsTableContainerComponent } from './table/downloads-table-container.component';
import { DownloadsTablePresentationComponent } from './table/downloads-table-presentation.component';
import { ScrollingTableComponent } from './table/scrolling-table.component';
import { SummaryTableComponent } from './table/summary-table.component';

import { downloadsRouting } from './downloads.routing';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartContainerComponent,
    DownloadsChartPresentationComponent,
    DownloadsTableContainerComponent,
    DownloadsTablePresentationComponent,
    ScrollingTableComponent,
    SummaryTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FancyFormModule,
    downloadsRouting
  ]
})

export class DownloadsModule { }
