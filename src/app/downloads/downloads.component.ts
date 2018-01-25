import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { CastleService } from '../core';
import { CastlePodcastMetricsAction, CastleEpisodeMetricsAction,
  GoogleAnalyticsEventAction, CastleEpisodeChartToggleAction } from '../ngrx/actions';
import { RouterModel, EpisodeModel, PodcastModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, EPISODE_PAGE_SIZE, METRICSTYPE_DOWNLOADS, getMetricsProperty } from '../ngrx';
import { selectRouter, selectEpisodes, selectPodcasts } from '../ngrx/reducers';
import { filterPodcastEpisodePage } from '../shared/util/metrics.util';
import * as dateUtil from '../shared/util/date';
import { isPodcastChanged, isBeginDateChanged, isEndDateChanged, isIntervalChanged } from '../shared/util/filter.util';

@Component({
  template: `
    <prx-spinner *ngIf="isPodcastLoading || isEpisodeLoading" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <router-outlet name="sidenav"></router-outlet>
    <section class="content" *ngIf="podcasts">
      <metrics-menu-bar *ngIf="!isPodcastLoading && !isEpisodeLoading"></metrics-menu-bar>
      <metrics-downloads-chart></metrics-downloads-chart>
      <metrics-downloads-table [totalPages]="totalPages"></metrics-downloads-table>
      <p class="error" *ngFor="let error of errors">{{error}}</p>
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
  isPodcastLoading = true;
  isEpisodeLoading = true;
  errors: string[] = [];

  constructor(private castle: CastleService,
              public store: Store<any>,
              private router: Router) {}

  ngOnInit() {
    this.toggleLoading(true, true);

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
              this.toggleLoading(true, true);
            }
            this.routerState.chartType = newRouterState.chartType;
            this.routerState.chartPodcast = newRouterState.chartPodcast;
            this.routerState.episodeIds = newRouterState.episodeIds;

            if (isPodcastChanged(newRouterState, this.routerState)) {
              this.routerState.podcastSeriesId = newRouterState.podcastSeriesId;
              this.resetEpisodes();
              this.toggleLoading(true, true);
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

  toggleLoading(isPodcastLoading, isEpisodeLoading = this.isEpisodeLoading) {
    this.isPodcastLoading = isPodcastLoading;
    this.isEpisodeLoading = isEpisodeLoading;
    if (this.isPodcastLoading && this.isEpisodeLoading) {
      this.errors = [];
    }
  }

  showError(errorCode: number, type: 'podcast' | 'episode', title: string) {
    const errorType = errorCode === 401 ? 'Authorization' : 'Unknown';
    this.errors.push(`${errorType} error occurred while requesting ${type} metrics on ${title}`);
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
    this.toggleLoading(true);
    this.castle.followList('prx:podcast-downloads', {
      id: podcast.feederId,
      from: this.routerState.beginDate.toISOString(),
      to: this.routerState.endDate.toISOString(),
      interval: this.routerState.interval.value
    }).subscribe(
      metrics => this.setPodcastMetrics(podcast, metrics),
      err => {
        this.toggleLoading(false);
        this.showError(err.status, 'podcast', podcast.title);
      }
    );
  }

  setPodcastMetrics(podcast: PodcastModel, metrics: any) {
    this.toggleLoading(false);
    if (metrics && metrics.length && metrics[0]['downloads']) {
      this.store.dispatch(new CastlePodcastMetricsAction({
        podcast,
        metricsPropertyName: getMetricsProperty(this.routerState.interval, this.routerState.metricsType),
        metrics: metrics[0]['downloads']
      }));
      this.googleAnalyticsEvent('load', metrics[0]['downloads'].length);
    }
  }

  googleAnalyticsEvent(gaAction, value) {
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction, value}));
  }

  getEpisodeMetrics() {
    this.toggleLoading(this.isPodcastLoading, true);
    this.pageEpisodes.forEach((episode: EpisodeModel) => {
      if (episode && episode.guid) {
        this.castle.followList('prx:episode-downloads', {
          guid: episode.guid,
          from: this.routerState.beginDate.toISOString(),
          to: this.routerState.endDate.toISOString(),
          interval: this.routerState.interval.value
        }).subscribe(
          metrics => this.setEpisodeMetrics(episode, metrics),
          err => {
            this.toggleLoading(this.isPodcastLoading, false);
            this.showError(err.status, 'episode', episode.title);
          }
        );
      }
    });
  }

  setEpisodeMetrics(episode: EpisodeModel, metrics: any) {
    this.toggleLoading(this.isPodcastLoading, false);
    if (metrics && metrics.length && metrics[0]['downloads']) {
      this.store.dispatch(new CastleEpisodeMetricsAction({
        episode,
        metricsPropertyName: getMetricsProperty(this.routerState.interval, this.routerState.metricsType),
        metrics: metrics[0]['downloads']
      }));
    }
  }
}
