import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CastleService } from '../core';
import * as ACTIONS from '../ngrx/actions';
import { RouterModel, EpisodeModel, PodcastModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, EPISODE_PAGE_SIZE, METRICSTYPE_DOWNLOADS, getMetricsProperty } from '../ngrx';
import { selectRouter, selectEpisodes, selectPodcasts, selectLoading, selectLoaded, selectErrors } from '../ngrx/reducers';
import { filterPodcastEpisodePage } from '../shared/util/metrics.util';
import * as dateUtil from '../shared/util/date';
import { isPodcastChanged, isBeginDateChanged, isEndDateChanged, isIntervalChanged } from '../shared/util/filter.util';

@Component({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <router-outlet name="sidenav"></router-outlet>
    <section class="content" *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-downloads-chart></metrics-downloads-chart>
      <metrics-downloads-table [totalPages]="totalPages"></metrics-downloads-table>
      <p class="error" *ngFor="let error of errors$ | async">{{error}}</p>
    </section>
  `,
  styleUrls: ['../shared/nav/nav-content.css', 'downloads.component.css']
})
export class DownloadsComponent implements OnInit, OnDestroy {
  podcastSub: Subscription;
  podcasts: PodcastModel[];
  podcast: PodcastModel;
  episodeSub: Subscription;
  pageEpisodes: EpisodeModel[];
  totalPages: number;
  routerSub: Subscription;
  routerState: RouterModel;
  updatePodcast: boolean;
  updateEpisodes: boolean;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<string[]>;

  constructor(private castle: CastleService,
              public store: Store<any>,
              private router: Router) {
    this.loading$ = this.store.select(selectLoading);
    this.loaded$ = this.store.select(selectLoaded);
    this.errors$ = this.store.select(selectErrors);
  }

  ngOnInit() {
    this.subPodcastsAndRoute();
  }

  subPodcastsAndRoute() {
    this.podcastSub = this.store.select(selectPodcasts).subscribe((podcasts: PodcastModel[]) => {
      if (podcasts && podcasts.length) {
        this.podcasts = podcasts;

        if (!this.routerSub) {
          this.routerSub = this.store.select(selectRouter).subscribe((newRouterState: RouterModel) => {
            if (!this.routerState) {
              this.setDefaultRouteFromExistingRoute(newRouterState);
              this.updatePodcast = this.updateEpisodes = true;
              if (!this.episodeSub) {
                this.subEpisodes();
              }
            }
            this.routerState.chartType = newRouterState.chartType;
            this.routerState.chartPodcast = newRouterState.chartPodcast;
            this.routerState.episodeIds = newRouterState.episodeIds;

            if (isPodcastChanged(newRouterState, this.routerState)) {
              this.routerState.podcastSeriesId = newRouterState.podcastSeriesId;
              this.resetEpisodes();
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (newRouterState.page !== this.routerState.page) {
              this.routerState.page = newRouterState.page;
              this.resetEpisodes();
              this.updateEpisodes = true;
            }
            if (isBeginDateChanged(newRouterState, this.routerState)) {
              this.routerState.beginDate = newRouterState.beginDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (isEndDateChanged(newRouterState, this.routerState)) {
              this.routerState.endDate = newRouterState.endDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (isIntervalChanged(newRouterState, this.routerState)) {
              this.routerState.interval = newRouterState.interval;
              this.updatePodcast = this.updateEpisodes = true;
            }

            if (this.updatePodcast && this.routerState.podcastSeriesId) {
              this.podcast = this.podcasts.find(p => p.seriesId === this.routerState.podcastSeriesId);
              this.totalPages = this.podcast.doc.count('prx:stories') / EPISODE_PAGE_SIZE;
              if (this.podcast.doc.count('prx:stories') % EPISODE_PAGE_SIZE > 0) {
                this.totalPages++;
              }
              if (this.podcast) {
                this.getPodcastMetrics(this.podcast);
                this.updatePodcast = false;
              }
            }

            // if episodes were already loaded, update episode metrics with routerState change
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
    // update episodes separate from routerState change when we're waiting on the episodes to load
    this.episodeSub = this.store.select(selectEpisodes).subscribe((allAvailableEpisodes: EpisodeModel[]) => {
      const episodes = filterPodcastEpisodePage(this.routerState, allAvailableEpisodes);
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

  setDefaultRouteFromExistingRoute(existingRouterState: RouterModel) {
    // dispatch some default values for the dates and interval
    this.routerState = {
      page: 1,
      standardRange: dateUtil.THIS_WEEK_PLUS_7_DAYS,
      beginDate: dateUtil.beginningOfThisWeekPlus7DaysUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY,
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      chartType: <ChartType>CHARTTYPE_PODCAST
    };
    if (existingRouterState.page) {
      this.routerState.page = existingRouterState.page;
    }
    if (existingRouterState.standardRange) {
      this.routerState.standardRange = existingRouterState.standardRange;
    }
    if (existingRouterState.beginDate) {
      this.routerState.beginDate = existingRouterState.beginDate;
    }
    if (existingRouterState.endDate) {
      this.routerState.endDate = existingRouterState.endDate;
    }
    if (existingRouterState.interval) {
      this.routerState.interval = existingRouterState.interval;
    }
    if (existingRouterState.chartType) {
      this.routerState.chartType = existingRouterState.chartType;
    }
    if (existingRouterState.podcastSeriesId) {
      this.routerState.podcastSeriesId = existingRouterState.podcastSeriesId;
      this.routeFromModel(this.routerState);
    }
  }

  routeFromModel(routerState: RouterModel) {
    const params = {
      page: routerState.page,
      beginDate: routerState.beginDate.toISOString(),
      endDate: routerState.endDate.toISOString(),
      standardRange: routerState.standardRange
    };

    if (routerState.chartPodcast !== undefined) {
      params['chartPodcast'] = routerState.chartPodcast;
    } else {
      params['chartPodcast'] = true; // true is the default
    }

    if (routerState.episodeIds) {
      params['episodes'] = routerState.episodeIds.join(',');
    }
    this.router.navigate([routerState.podcastSeriesId, 'downloads', routerState.chartType, routerState.interval.key, params]);
  }

  getPodcastMetrics(podcast: PodcastModel) {
    this.store.dispatch(new ACTIONS.CastlePodcastMetricsLoadAction({
      seriesId: podcast.seriesId,
      feederId: podcast.feederId,
      metricsType: this.routerState.metricsType,
      interval: this.routerState.interval,
      beginDate: this.routerState.beginDate,
      endDate: this.routerState.endDate
    }));
  }

  getEpisodeMetrics() {
    this.pageEpisodes.forEach((episode: EpisodeModel) => {
      if (episode && episode.guid) {
        this.store.dispatch(new ACTIONS.CastleEpisodeMetricsLoadAction({
          seriesId: episode.seriesId,
          page: episode.page,
          id: episode.id,
          guid: episode.guid,
          metricsType: this.routerState.metricsType,
          interval: this.routerState.interval,
          beginDate: this.routerState.beginDate,
          endDate: this.routerState.endDate
        }));
      }
    });
  }
}
