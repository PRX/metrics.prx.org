import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SelectModule, SpinnerModule } from 'ngx-prx-styleguide';

import { CustomDateRangeComponent } from './filter/date/custom-date-range.component';
import { DateRangeComponent } from './filter/date/date-range.component';
import { EpisodesComponent } from './filter/episodes.component';
import { FilterComponent } from './filter/filter.component';
import { IntervalComponent } from './filter/interval.component';
import { NextDateRangeComponent } from './filter/date/next-date-range.component';
import { PodcastsComponent } from './filter/podcasts.component';
import { PrevDateRangeComponent } from './filter/date/prev-date-range.component';
import { StandardDateRangeComponent } from './filter/date/standard-date-range.component';

@NgModule({
  declarations: [
    CustomDateRangeComponent,
    DateRangeComponent,
    EpisodesComponent,
    FilterComponent,
    IntervalComponent,
    NextDateRangeComponent,
    PodcastsComponent,
    PrevDateRangeComponent,
    StandardDateRangeComponent,
  ],
  exports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ImageModule,
    SelectModule,
    SpinnerModule,
    FilterComponent,
    PodcastsComponent
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
