import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { NavMenuComponent } from './nav/nav-menu.component';
import { EpisodePageComponent } from './paging/episode-page.component';
import { LargeNumberPipe } from './pipes/large-number.pipe';
import { ProfileComponent } from './profile/profile.component';
import { DownloadsSummaryContainerComponent } from './summary/downloads-summary-container.component';
import { DownloadsSummaryItemComponent } from './summary/downloads-summary-item.component';

@NgModule({
  declarations: [
    ChartTypeComponent,
    CustomDateRangeDropdownComponent,
    DateRangeSummaryComponent,
    DownloadsSummaryContainerComponent,
    DownloadsSummaryItemComponent,
    EpisodePageComponent,
    IntervalDropdownComponent,
    LargeNumberPipe,
    MenuBarComponent,
    NavMenuComponent,
    PodcastNavDropdownComponent,
    PodcastNavListComponent,
    PodcastNavComponent,
    ProfileComponent,
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
    NavMenuComponent,
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
