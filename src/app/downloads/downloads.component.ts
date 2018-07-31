import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CastleService } from '../core';
import * as ACTIONS from '../ngrx/actions';
import { RouterParams, Episode, EpisodeModel, PodcastModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, EPISODE_PAGE_SIZE, METRICSTYPE_DOWNLOADS } from '../ngrx';
import { selectRouter, selectEpisodes, selectPodcasts, selectLoading, selectLoaded, selectErrors,
  selectNumEpisodePages, selectRoutedPageEpisodes } from '../ngrx/reducers/selectors';
import { filterPodcastEpisodePage } from '../shared/util/metrics.util';
import * as dateUtil from '../shared/util/date';
import { isPodcastChanged, isBeginDateChanged, isEndDateChanged, isIntervalChanged } from '../shared/util/filter.util';

@Component({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-downloads-chart></metrics-downloads-chart>
      <metrics-downloads-table [totalPages]="selectNumEpisodePages$ | async"></metrics-downloads-table>
      <p class="error" *ngFor="let error of errors$ | async">{{error}}</p>
    </section>
  `,
  styleUrls: ['downloads.component.css']
})
export class DownloadsComponent implements OnInit {
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<string[]>;
  selectNumEpisodePages$: Observable<number>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectLoading));
    this.loaded$ = this.store.pipe(select(selectLoaded));
    this.errors$ = this.store.pipe(select(selectErrors));
    this.selectNumEpisodePages$ = this.store.pipe(select(selectNumEpisodePages));
  }
}
