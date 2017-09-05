import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';

@NgModule({
  declarations: [
    DownloadsComponent
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
