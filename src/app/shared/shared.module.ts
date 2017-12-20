import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SelectModule, SpinnerModule } from 'ngx-prx-styleguide';

import { CustomDateRangeComponent } from './filter/date/custom-date-range.component';
import { DateRangeComponent } from './filter/date/date-range.component';
import { EpisodePageComponent } from './filter/episode-page.component';
import { FilterComponent } from './filter/filter.component';
import { IntervalComponent } from './filter/interval.component';
import { LargeNumberPipe } from './pipes/large-number.pipe';
import { NextDateRangeComponent } from './filter/date/next-date-range.component';
import { PodcastsComponent } from './filter/podcasts.component';
import { PrevDateRangeComponent } from './filter/date/prev-date-range.component';
import { StandardDateRangeComponent } from './filter/date/standard-date-range.component';

@NgModule({
  declarations: [
    CustomDateRangeComponent,
    DateRangeComponent,
    EpisodePageComponent,
    FilterComponent,
    IntervalComponent,
    LargeNumberPipe,
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
    LargeNumberPipe,
    EpisodePageComponent,
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
