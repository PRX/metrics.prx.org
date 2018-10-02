import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { GeoComponent } from './geo.component';
import { GeochartMapComponent } from './geochart.map.component';

import { geoRouting } from './geo.routing';

@NgModule({
  declarations: [
    GeoComponent,
    GeochartMapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    geoRouting
  ]
})

export class GeoModule { }
