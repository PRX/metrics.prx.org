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
export class DownloadsComponent implements OnInit, OnDestroy {
  podcastSub: Subscription;
  podcasts: PodcastModel[];
  podcast: PodcastModel;
  castleEpisodeSub: Subscription;
  episodeSub: Subscription;
  pageEpisodes: EpisodeModel[];
  castlePageEpisodes: Episode[];
  totalPages: number;
  routerSub: Subscription;
  routerParams: RouterParams;
  updatePodcast: boolean;
  updateEpisodes: boolean;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<string[]>;
  selectNumEpisodePages$: Observable<number>;

  constructor(private castle: CastleService,
              public store: Store<any>,
              private router: Router) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectLoading));
    this.loaded$ = this.store.pipe(select(selectLoaded));
    this.errors$ = this.store.pipe(select(selectErrors));
    this.selectNumEpisodePages$ = this.store.pipe(select(selectNumEpisodePages));

    this.subPodcastsAndRoute();
  }

  subPodcastsAndRoute() {
    this.podcastSub = this.store.pipe(select(selectPodcasts)).subscribe((podcasts: PodcastModel[]) => {
      if (podcasts && podcasts.length) {
        this.podcasts = podcasts;

        if (!this.routerSub) {
          this.routerSub = this.store.pipe(select(selectRouter)).subscribe((newRouterParams: RouterParams) => {
            if (!this.routerParams) {
              this.setDefaultRouteFromExistingRoute(newRouterParams);
              this.updatePodcast = this.updateEpisodes = true;
              if (!this.episodeSub) {
                this.subEpisodes();
              }
            }
            this.routerParams.chartType = newRouterParams.chartType;
            this.routerParams.chartPodcast = newRouterParams.chartPodcast;
            this.routerParams.episodeIds = newRouterParams.episodeIds;

            if (isPodcastChanged(newRouterParams, this.routerParams)) {
              this.routerParams.podcastSeriesId = newRouterParams.podcastSeriesId;
              this.resetEpisodes();
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (newRouterParams.episodePage !== this.routerParams.episodePage) {
              this.routerParams.episodePage = newRouterParams.episodePage;
              this.resetEpisodes();
              this.updateEpisodes = true;
            }
            if (isBeginDateChanged(newRouterParams, this.routerParams)) {
              this.routerParams.beginDate = newRouterParams.beginDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (isEndDateChanged(newRouterParams, this.routerParams)) {
              this.routerParams.endDate = newRouterParams.endDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (isIntervalChanged(newRouterParams, this.routerParams)) {
              this.routerParams.interval = newRouterParams.interval;
              this.updatePodcast = this.updateEpisodes = true;
            }

            if (this.updatePodcast && this.routerParams.podcastSeriesId) {
              this.podcast = this.podcasts.find(p => p.seriesId === this.routerParams.podcastSeriesId);
              const numEpisodes = this.podcast ? this.podcast.doc.count('prx:stories') : 0;
              this.totalPages = numEpisodes / EPISODE_PAGE_SIZE;
              if (numEpisodes % EPISODE_PAGE_SIZE > 0) {
                this.totalPages++;
              }
              if (this.podcast) {
                this.getPodcastMetrics(this.podcast);
                this.updatePodcast = false;
              }
            }

            // if episodes were already loaded, update episode metrics with routerParams change
            if (this.updateEpisodes && this.pageEpisodes) {
              this.getEpisodeMetrics();
              this.updateEpisodes = false;
            }
          });
        }
      }
    });
  }

  subEpisodes() {
    // update episodes separate from routerParams change when we're waiting on the episodes to load
    // TODO: undo
    this.castleEpisodeSub = this.store.pipe(select(selectRoutedPageEpisodes)).subscribe((pageEpisodes: Episode[]) => {
      this.castlePageEpisodes = pageEpisodes;
    });
    this.episodeSub = this.store.pipe(select(selectEpisodes)).subscribe((allAvailableEpisodes: EpisodeModel[]) => {
      const episodes = filterPodcastEpisodePage(this.routerParams, allAvailableEpisodes);
      if (episodes && episodes.length) {
        this.pageEpisodes = episodes;
        if (this.updateEpisodes) {
          this.getEpisodeMetrics();
          this.updateEpisodes = false;
        }
      }
    });
  }

  resetEpisodes() {
    this.pageEpisodes = null;
  }

  ngOnDestroy() {
    if (this.routerSub) { this.routerSub.unsubscribe(); }
    if (this.podcastSub) { this.podcastSub.unsubscribe(); }
    if (this.episodeSub) { this.episodeSub.unsubscribe(); }
  }

  setDefaultRouteFromExistingRoute(existingRouterParams: RouterParams) {
    // dispatch some default values for the dates and interval
    this.routerParams = {
      episodePage: 1,
      standardRange: dateUtil.THIS_WEEK,
      beginDate: dateUtil.beginningOfLast28DaysUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY,
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      chartType: <ChartType>CHARTTYPE_PODCAST
    };
    if (existingRouterParams.episodePage) {
      this.routerParams.episodePage = existingRouterParams.episodePage;
    }
    if (existingRouterParams.episodeIds) {
      this.routerParams.episodeIds = existingRouterParams.episodeIds;
    }
    if (existingRouterParams.standardRange) {
      this.routerParams.standardRange = existingRouterParams.standardRange;
    }
    if (existingRouterParams.beginDate) {
      this.routerParams.beginDate = existingRouterParams.beginDate;
    }
    if (existingRouterParams.endDate) {
      this.routerParams.endDate = existingRouterParams.endDate;
    }
    if (existingRouterParams.interval) {
      this.routerParams.interval = existingRouterParams.interval;
    }
    if (existingRouterParams.chartType) {
      this.routerParams.chartType = existingRouterParams.chartType;
    }
    if (existingRouterParams.podcastSeriesId && existingRouterParams.podcastId) {
      this.routerParams.podcastSeriesId = existingRouterParams.podcastSeriesId;
      this.routerParams.podcastId = existingRouterParams.podcastId;
      this.routeFromModel(this.routerParams);
    }
  }

  routeFromModel(routerParams: RouterParams) {
    const params = {
      episodePage: routerParams.episodePage,
      beginDate: routerParams.beginDate.toISOString(),
      endDate: routerParams.endDate.toISOString(),
      standardRange: routerParams.standardRange
    };

    if (routerParams.chartPodcast !== undefined) {
      params['chartPodcast'] = routerParams.chartPodcast;
    } else {
      params['chartPodcast'] = true; // true is the default
    }

    if (routerParams.episodeIds) {
      params['episodes'] = routerParams.episodeIds.join(',');
    }
    this.router.navigate([routerParams.podcastSeriesId, routerParams.podcastId, METRICSTYPE_DOWNLOADS, routerParams.chartType, routerParams.interval.key, params]);
  }

  getPodcastMetrics(podcast: PodcastModel) {
    this.store.dispatch(new ACTIONS.CastlePodcastMetricsLoadAction({
      seriesId: podcast.seriesId,
      feederId: podcast.feederId,
      metricsType: this.routerParams.metricsType,
      interval: this.routerParams.interval,
      beginDate: this.routerParams.beginDate,
      endDate: this.routerParams.endDate
    }));
  }

  getEpisodeMetrics() {
    this.castlePageEpisodes.forEach((episode: Episode) => {
      if (episode && episode.guid) {
        this.store.dispatch(new ACTIONS.CastleEpisodeMetricsLoadAction({
          seriesId: 0,
          feederId: episode.podcastId,
          page: episode.page,
          guid: episode.guid,
          metricsType: this.routerParams.metricsType,
          interval: this.routerParams.interval,
          beginDate: this.routerParams.beginDate,
          endDate: this.routerParams.endDate
        }));
      }
    });
  }
}
