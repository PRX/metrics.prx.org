import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { GeoComponent } from './geo.component';

import { geoRouting } from './geo.routing';

@NgModule({
  declarations: [
    GeoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    geoRouting
  ]
})

export class GeoModule { }
