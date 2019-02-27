import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, FancyFormModule, ImageModule, SpinnerModule } from 'ngx-prx-styleguide';

import { ErrorRetryComponent } from './error/error-retry.component';
import { CustomDateRangeDropdownComponent } from './menu/date/custom-date-range-dropdown.component';
import { DateRangeSummaryComponent } from './menu/date/date-range-summary.component';
import { StandardDateRangeComponent } from './menu/date/standard-date-range.component';
import { StandardDateRangeDropdownComponent } from './menu/date/standard-date-range-dropdown.component';
import { EpisodeSearchComponent } from './menu/episode-select/episode-search.component';
import { EpisodeSelectAccumulatorComponent } from './menu/episode-select/episode-select-accumulator.component';
import { EpisodeSelectComponent } from './menu/episode-select/episode-select.component';
import { EpisodeSelectDropdownComponent } from './menu/episode-select/episode-select-dropdown.component';
import { EpisodeSelectDropdownButtonComponent } from './menu/episode-select/episode-select-dropdown-button.component';
import { EpisodeSelectDropdownContentComponent } from './menu/episode-select/episode-select-dropdown-content.component';
import { EpisodeSelectDropdownService } from './menu/episode-select/episode-select-dropdown.service';
import { EpisodeSelectListComponent } from './menu/episode-select/episode-select-list.component';
import { EpisodeSelectListVisibilityComponent } from './menu/episode-select/episode-select-list-visibility.component';
import { ExportDropdownComponent } from './menu/export/export-dropdown.component';
import { ExportGoogleSheetsComponent } from './menu/export/export-google-sheets.component';
import { ExportGoogleSheetsService } from './menu/export/export-google-sheets.service';
import { ChartTypeComponent } from './menu/chart-type.component';
import { IntervalDropdownComponent } from './menu/interval-dropdown.component';
import { MetricsTypeHeadingComponent } from './menu/metrics-type-heading.component';
import { MenuBarComponent } from './menu/menu-bar.component';
import { PodcastNavComponent } from './podcast-nav/podcast-nav.component';
import { PodcastNavDropdownComponent } from './podcast-nav/podcast-nav-dropdown.component';
import { PodcastNavListComponent } from './podcast-nav/podcast-nav-list.component';
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
    EpisodeSelectAccumulatorComponent,
    EpisodeSelectComponent,
    EpisodeSelectDropdownComponent,
    EpisodeSelectDropdownButtonComponent,
    EpisodeSelectDropdownContentComponent,
    EpisodeSelectListComponent,
    EpisodeSelectListVisibilityComponent,
    ErrorRetryComponent,
    ExportDropdownComponent,
    ExportGoogleSheetsComponent,
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
    EpisodeSelectComponent,
    EpisodeSelectDropdownComponent,
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
    UnauthGuard,
    EpisodeSelectDropdownService,
    ExportGoogleSheetsService
  ]
})

export class SharedModule { }
