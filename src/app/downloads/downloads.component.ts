import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { CastleService } from '../core';
import { CastleFilterAction, CastlePodcastMetricsAction, CastleEpisodeMetricsAction,
  GoogleAnalyticsEventAction, CastleEpisodeChartToggleAction } from '../ngrx/actions';
import { FilterModel, EpisodeModel, PodcastModel, INTERVAL_DAILY, EPISODE_PAGE_SIZE } from '../ngrx';
import { selectFilter, selectEpisodes, selectPodcasts } from '../ngrx/reducers';
import { filterPodcastEpisodePage } from '../shared/util/metrics.util';
import * as dateUtil from '../shared/util/date';
import { isPodcastChanged, isBeginDateChanged, isEndDateChanged, isIntervalChanged } from '../shared/util/filter.util';

@Component({
  selector: 'metrics-downloads',
  template: `
    <prx-spinner *ngIf="isPodcastLoading || isEpisodeLoading" overlay="true" loadingMessage="Please wait..."></prx-spinner>
    <!--<section class="profile">
    </section>-->
    <section class="content">
      <metrics-menu-bar *ngIf="!isPodcastLoading && !isEpisodeLoading" (routeFromFilter)="routeFromFilter($event)"></metrics-menu-bar>
      <metrics-downloads-chart></metrics-downloads-chart>
      <metrics-downloads-table
        [totalPages]="totalPages" (pageChange)="onPageChange($event)"
        (podcastChartToggle)="onPodcastChartToggle($event)" (episodeChartToggle)="onEpisodeChartToggle($event)">
      </metrics-downloads-table>
      <p class="error" *ngFor="let error of errors">{{error}}</p>
    </section>
  `,
  styleUrls: ['downloads.component.css']
})
export class DownloadsComponent implements OnInit, OnDestroy {
  podcastSub: Subscription;
  podcasts: PodcastModel[];
  podcast: PodcastModel;
  episodeSub: Subscription;
  pageEpisodes: EpisodeModel[];
  totalPages: number;
  filterSub: Subscription;
  filter: FilterModel;
  updatePodcast: boolean;
  updateEpisodes: boolean;
  isPodcastLoading = true;
  isEpisodeLoading = true;
  errors: string[] = [];
  chartPodcast: boolean;
  chartedEpisodes: number[];

  constructor(private castle: CastleService,
              public store: Store<any>,
              private router: Router,
              private route: ActivatedRoute) {
    route.params.subscribe(params => {
      if (params['chartPodcast']) {
        this.chartPodcast = params['chartPodcast'] === 'true';
      }
      if (params['episodes']) {
        this.chartedEpisodes = params['episodes'].split(',').map(id => +id);
      }
    });
  }

  ngOnInit() {
    this.toggleLoading(true, true);

    this.subPodcastsAndFilter();
  }

  subPodcastsAndFilter() {
    this.podcastSub = this.store.select(selectPodcasts).subscribe((podcasts: PodcastModel[]) => {
      if (podcasts && podcasts.length) {
        this.podcasts = podcasts;

        if (!this.filterSub) {
          this.filterSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
            if (!this.filter) {
              this.setDefaultFilterFromRoute(newFilter);
              this.updatePodcast = this.updateEpisodes = true;
              if (!this.episodeSub) {
                this.subEpisodes();
              }
              this.toggleLoading(true, true);
            }

            if (isPodcastChanged(newFilter, this.filter)) {
              this.filter.podcastSeriesId = newFilter.podcastSeriesId;
              this.resetEpisodes();
              this.toggleLoading(true, true);
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (newFilter.page !== this.filter.page) {
              this.filter.page = newFilter.page;
              this.resetEpisodes();
              this.updateEpisodes = true;
            }
            if (isBeginDateChanged(newFilter, this.filter)) {
              this.filter.beginDate = newFilter.beginDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (isEndDateChanged(newFilter, this.filter)) {
              this.filter.endDate = newFilter.endDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (isIntervalChanged(newFilter, this.filter)) {
              this.filter.interval = newFilter.interval;
              this.updatePodcast = this.updateEpisodes = true;
            }

            if (this.updatePodcast && this.filter.podcastSeriesId) {
              this.podcast = this.podcasts.find(p => p.seriesId === this.filter.podcastSeriesId);
              this.totalPages = this.podcast.doc.count('prx:stories') / EPISODE_PAGE_SIZE;
              if (this.podcast.doc.count('prx:stories') % EPISODE_PAGE_SIZE > 0) {
                this.totalPages++;
              }
              if (this.podcast) {
                this.getPodcastMetrics(this.podcast);
                this.updatePodcast = false;
              }
            }

            // if episodes were already loaded, update episode metrics with filter change
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
    // update episodes separate from filter change when we're waiting on the episodes to load
    this.episodeSub = this.store.select(selectEpisodes).subscribe((allAvailableEpisodes: EpisodeModel[]) => {
      const episodes = filterPodcastEpisodePage(this.filter, allAvailableEpisodes);
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
    if (this.filterSub) { this.filterSub.unsubscribe(); }
    if (this.podcastSub) { this.podcastSub.unsubscribe(); }
    if (this.episodeSub) { this.episodeSub.unsubscribe(); }
  }

  setDefaultFilterFromRoute(routingFilter: FilterModel) {
    // dispatch some default values for the dates and interval
    this.filter = {
      page: 1,
      standardRange: dateUtil.THIS_WEEK_PLUS_7_DAYS,
      beginDate: dateUtil.beginningOfThisWeekPlus7DaysUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    if (routingFilter.page) {
      this.filter.page = routingFilter.page;
    }
    if (routingFilter.standardRange) {
      this.filter.standardRange = routingFilter.standardRange;
    }
    if (routingFilter.beginDate) {
      this.filter.beginDate = routingFilter.beginDate;
    }
    if (routingFilter.endDate) {
      this.filter.endDate = routingFilter.endDate;
    }
    if (routingFilter.interval) {
      this.filter.interval = routingFilter.interval;
    }
    if (routingFilter.podcastSeriesId) {
      this.filter.podcastSeriesId = routingFilter.podcastSeriesId;
      this.routeFromFilter(this.filter, undefined, undefined);
    } else {
      this.store.dispatch(new CastleFilterAction({filter: this.filter}));
    }
  }

  routeFromFilter(filter: FilterModel, podcastToggle: boolean, episodeToggle: {id: number, charted: boolean}) {
    const params = {
      page: filter.page,
      beginDate: filter.beginDate.toISOString(),
      endDate: filter.endDate.toISOString(),
      standardRange: filter.standardRange
    };
    if (podcastToggle !== undefined) {
      params['chartPodcast'] = podcastToggle;
    } else if (this.chartPodcast !== undefined) {
      params['chartPodcast'] = this.chartPodcast;
    } else {
      params['chartPodcast'] = true; // true is the default
    }

    if (episodeToggle !== undefined && this.chartedEpisodes) {
      if (episodeToggle.charted) {
        // positive state changes on episodes are reflected in and dispatch through the route
        params['episodes'] = this.chartedEpisodes.join(',') + ',' + episodeToggle.id;
      } else {
        // update the route and the state, negative state changes on episodes aren't reflected in route
        this.chartedEpisodes = this.chartedEpisodes.filter(id => id !== episodeToggle.id);
        params['episodes'] = this.chartedEpisodes.join(',');
        this.store.dispatch(new CastleEpisodeChartToggleAction({id: episodeToggle.id, seriesId: filter.podcastSeriesId, charted: false}));
      }
    } else if (episodeToggle !== undefined) {
      if (episodeToggle.charted) {
        params['episodes'] = episodeToggle.id;
      }
    } else if (this.chartedEpisodes) {
      params['episodes'] = this.chartedEpisodes.join(',');
    }
    this.router.navigate([filter.podcastSeriesId, 'downloads', filter.interval.key, params]);
  }

  getPodcastMetrics(podcast: PodcastModel) {
    this.toggleLoading(true);
    this.castle.followList('prx:podcast-downloads', {
      id: podcast.feederId,
      from: this.filter.beginDate.toISOString(),
      to: this.filter.endDate.toISOString(),
      interval: this.filter.interval.value
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
        filter: this.filter,
        metricsType: 'downloads',
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
          from: this.filter.beginDate.toISOString(),
          to: this.filter.endDate.toISOString(),
          interval: this.filter.interval.value
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
        filter: this.filter,
        metricsType: 'downloads',
        metrics: metrics[0]['downloads']
      }));
    }
  }

  onPageChange(page: number) {
    this.routeFromFilter({...this.filter, page}, undefined, undefined);
  }

  onPodcastChartToggle(charted: boolean) {
    this.routeFromFilter(this.filter, charted, undefined);
  }

  onEpisodeChartToggle(params: {id: number, charted: boolean}) {
    this.routeFromFilter(this.filter, undefined, params);
  }
}
