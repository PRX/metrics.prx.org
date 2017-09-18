import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';
import { DownloadsDaterangeComponent } from './downloads-daterange';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartComponent,
    DownloadsDaterangeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DownloadsComponent
  ],
  providers: []
})

export class DownloadsModule { }
