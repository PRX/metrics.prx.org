import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SpinnerModule } from 'ngx-prx-styleguide';

import { ChartTypeComponent } from './menu/chart-type.component';
import { IntervalDropdownComponent } from './menu/interval-dropdown.component';
import { MenuBarComponent } from './menu/menu-bar.component';
import { PodcastNavComponent } from './podcast-nav/podcast-nav.component';
import { PodcastNavDropdownComponent } from './podcast-nav/podcast-nav-dropdown.component';
import { PodcastNavListComponent } from './podcast-nav/podcast-nav-list.component';
import { CustomDateRangeDropdownComponent } from './menu/date/custom-date-range-dropdown.component';
import { DateRangeSummaryComponent } from './menu/date/date-range-summary.component';
import { StandardDateRangeComponent } from './menu/date/standard-date-range.component';
import { StandardDateRangeDropdownComponent } from './menu/date/standard-date-range-dropdown.component';
import { EpisodePageComponent } from './paging/episode-page.component';
import { LargeNumberPipe } from './pipes/large-number.pipe';

@NgModule({
  declarations: [
    ChartTypeComponent,
    CustomDateRangeDropdownComponent,
    DateRangeSummaryComponent,
    EpisodePageComponent,
    IntervalDropdownComponent,
    LargeNumberPipe,
    MenuBarComponent,
    PodcastNavDropdownComponent,
    PodcastNavListComponent,
    PodcastNavComponent,
    StandardDateRangeComponent,
    StandardDateRangeDropdownComponent
  ],
  exports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ImageModule,
    MenuBarComponent,
    SpinnerModule,
    LargeNumberPipe,
    EpisodePageComponent,
    PodcastNavComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ImageModule,
    SpinnerModule
  ],
  providers: [
    AuthGuard,
    DeactivateGuard,
    UnauthGuard
  ]
})

export class SharedModule { }
