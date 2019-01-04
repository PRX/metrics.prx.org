import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, FancyFormModule, ImageModule, SpinnerModule } from 'ngx-prx-styleguide';

import { EpisodeSearchComponent } from './episode-search/episode-search.component';
import { EpisodeSearchDropdownComponent } from './episode-search/episode-search-dropdown.component';
import { EpisodeSearchListComponent } from './episode-search/episode-search-list.component';
import { ErrorRetryComponent } from './error/error-retry.component';
import { MetricsTypeHeadingComponent } from './menu/metrics-type-heading.component';
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
import { NavMenuContainerComponent } from './nav/nav-menu-container.component';
import { NavMenuPresentationComponent } from './nav/nav-menu-presentation.component';
import { EpisodePageComponent } from './paging/episode-page.component';
import { AbrevNumberPipe } from './pipes/abrev-number.pipe';
import { LargeNumberPipe } from './pipes/large-number.pipe';
import { DownloadsSummaryComponent } from './summary/downloads-summary.component';
import { NestedTotalsTableComponent } from './table/nested-totals-table.component';
import { TotalsTableComponent } from './table/totals-table.component';

@NgModule({
  declarations: [
    AbrevNumberPipe,
    ChartTypeComponent,
    CustomDateRangeDropdownComponent,
    DateRangeSummaryComponent,
    DownloadsSummaryComponent,
    EpisodePageComponent,
    EpisodeSearchComponent,
    EpisodeSearchDropdownComponent,
    EpisodeSearchListComponent,
    ErrorRetryComponent,
    IntervalDropdownComponent,
    LargeNumberPipe,
    MenuBarComponent,
    MetricsTypeHeadingComponent,
    NavMenuContainerComponent,
    NavMenuPresentationComponent,
    NestedTotalsTableComponent,
    PodcastNavDropdownComponent,
    PodcastNavListComponent,
    PodcastNavComponent,
    StandardDateRangeComponent,
    StandardDateRangeDropdownComponent,
    TotalsTableComponent
  ],
  exports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ErrorRetryComponent,
    ImageModule,
    AbrevNumberPipe,
    MenuBarComponent,
    SpinnerModule,
    LargeNumberPipe,
    EpisodePageComponent,
    EpisodeSearchComponent,
    NavMenuContainerComponent,
    NestedTotalsTableComponent,
    PodcastNavComponent,
    TotalsTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule,
    DatepickerModule,
    FancyFormModule,
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
