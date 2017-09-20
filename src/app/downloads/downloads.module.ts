import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';

@NgModule({
  declarations: [
    DownloadsComponent,
    DownloadsChartComponent
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
