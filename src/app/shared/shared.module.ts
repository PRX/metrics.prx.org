import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SelectModule, SpinnerModule } from 'ngx-prx-styleguide';

import { CannedRangeComponent } from './filter/canned-range.component';
import { DateRangeComponent } from './filter/date-range.component';
import { IntervalComponent } from './filter/interval.component';

@NgModule({
  declarations: [
    CannedRangeComponent,
    DateRangeComponent,
    IntervalComponent
  ],
  exports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ImageModule,
    SelectModule,
    SpinnerModule,
    CannedRangeComponent,
    DateRangeComponent,
    IntervalComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ImageModule,
    SelectModule,
    SpinnerModule
  ],
  providers: [
    AuthGuard,
    DeactivateGuard,
    UnauthGuard
  ]
})

export class SharedModule { }
