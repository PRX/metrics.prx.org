import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SelectModule, SpinnerModule } from 'ngx-prx-styleguide';

import { ChartTypeComponent } from './menu/chart-type.component';
import { IntervalComponent } from './menu/interval.component';
import { MenuBarComponent } from './menu/menu-bar.component';
import { PodcastsComponent } from './menu/podcasts.component';
import { CustomDateRangeComponent } from './menu/date/custom-date-range.component';
import { CustomDateRangeDropdownComponent } from './menu/date/custom-date-range-dropdown.component';
import { StandardDateRangeComponent } from './menu/date/standard-date-range.component';
import { EpisodePageComponent } from './paging/episode-page.component';
import { LargeNumberPipe } from './pipes/large-number.pipe';

@NgModule({
  declarations: [
    ChartTypeComponent,
    CustomDateRangeComponent,
    CustomDateRangeDropdownComponent,
    EpisodePageComponent,
    IntervalComponent,
    LargeNumberPipe,
    MenuBarComponent,
    PodcastsComponent,
    StandardDateRangeComponent,
  ],
  exports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ImageModule,
    MenuBarComponent,
    SelectModule,
    SpinnerModule,
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
