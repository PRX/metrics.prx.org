import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SelectModule, SpinnerModule } from 'ngx-prx-styleguide';

import { CannedRangeComponent } from './filter/canned-range.component';
import { DateRangeComponent } from './filter/date-range.component';
import { EpisodesComponent } from './filter/episodes.component';
import { IntervalComponent } from './filter/interval.component';
import { PodcastsComponent } from './filter/podcasts.component';

@NgModule({
  declarations: [
    CannedRangeComponent,
    DateRangeComponent,
    EpisodesComponent,
    IntervalComponent,
    PodcastsComponent
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
    EpisodesComponent,
    IntervalComponent,
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
