import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '@app/shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartContainerComponent } from './chart/downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './chart/downloads-chart-presentation.component';
import { DownloadsTableContainerComponent } from './table/downloads-table-container.component';
import { DownloadsTablePresentationComponent } from './table/downloads-table-presentation.component';
import { DropdayComponent } from './dropday.component';
import { DropdayChartContainerComponent } from './chart/dropday-chart-container.component';
import { DropdayChartPresentationComponent } from './chart/dropday-chart-presentation.component';
import { DropdayTableComponent } from './table/dropday-table.component';
import { SummaryTableComponent } from './table/summary-table.component';
import { PlaceholderComponent } from './placeholder.component';

import { downloadsRouting } from './downloads.routing';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartContainerComponent,
    DownloadsChartPresentationComponent,
    DownloadsTableContainerComponent,
    DownloadsTablePresentationComponent,
    DropdayComponent,
    DropdayChartContainerComponent,
    DropdayChartPresentationComponent,
    DropdayTableComponent,
    SummaryTableComponent,
    PlaceholderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FancyFormModule,
    downloadsRouting
  ]
})

export class DownloadsModule { }
