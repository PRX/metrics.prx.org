import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SpinnerModule } from 'ngx-prx-styleguide';

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
import { DownloadsSummaryContainerComponent } from './summary/downloads-summary-container.component';
import { DownloadsSummaryItemComponent } from './summary/downloads-summary-item.component';

@NgModule({
  declarations: [
    AbrevNumberPipe,
    ChartTypeComponent,
    CustomDateRangeDropdownComponent,
    DateRangeSummaryComponent,
    DownloadsSummaryContainerComponent,
    DownloadsSummaryItemComponent,
    EpisodePageComponent,
    ErrorRetryComponent,
    IntervalDropdownComponent,
    LargeNumberPipe,
    MenuBarComponent,
    MetricsTypeHeadingComponent,
    NavMenuContainerComponent,
    NavMenuPresentationComponent,
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
    ErrorRetryComponent,
    ImageModule,
    AbrevNumberPipe,
    MenuBarComponent,
    SpinnerModule,
    LargeNumberPipe,
    EpisodePageComponent,
    NavMenuContainerComponent,
    PodcastNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
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
