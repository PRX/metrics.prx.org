import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';
import { DownloadsCannedrangeComponent } from './downloads-cannedrange.component';
import { DownloadsDaterangeComponent } from './downloads-daterange.component';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartComponent,
    DownloadsCannedrangeComponent,
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
