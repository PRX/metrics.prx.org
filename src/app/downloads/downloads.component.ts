import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Angulartics2 } from 'angulartics2';
import { CastleService } from '../core';
import { EpisodeModel, INTERVAL_DAILY, FilterModel, TWO_WEEKS, PodcastModel } from '../ngrx/model';
import { CastleFilterAction, CastlePodcastMetricsAction, CastleEpisodeMetricsAction } from '../ngrx/actions';
import { selectFilter, selectEpisodes, selectPodcasts } from '../ngrx/reducers';
import { filterAllPodcastEpisodes } from '../shared/util/metrics.util';
import { beginningOfTwoWeeksUTC, endOfTodayUTC, getRange } from '../shared/util/date.util';

@Component({
  selector: 'metrics-downloads',
  template: `
    <prx-spinner *ngIf="isPodcastLoading || isEpisodeLoading" overlay="true" loadingMessage="Please wait..."></prx-spinner>
    <section class="controls">
      <metrics-filter *ngIf="!isLoadingForTheFirstTime"></metrics-filter>
    </section>
    <section class="content">
      <metrics-downloads-chart></metrics-downloads-chart>
      <metrics-downloads-table></metrics-downloads-table>
      <p class="error" *ngFor="let error of errors">{{error}}</p>
    </section>
  `,
  styleUrls: ['downloads.component.css']
})
export class DownloadsComponent implements OnInit, OnDestroy {
  podcastSub: Subscription;
  podcasts: PodcastModel[];
  episodeSub: Subscription;
  allPodcastEpisodes: EpisodeModel[];
  filterSub: Subscription;
  filter: FilterModel;
  updatePodcast: boolean;
  updateEpisodes: boolean;
  isPodcastLoading = true;
  isEpisodeLoading = true;
  isLoadingForTheFirstTime = true;
  errors: string[] = [];
  static DONT_BREAK_CASTLE_LIMIT = 20;

  constructor(private castle: CastleService,
              public store: Store<any>,
              private router: Router,
              private angulartics2: Angulartics2) {}

  ngOnInit() {
    this.toggleLoading(true, true);

    this.subPodcastsAndFilter();
  }

  subPodcastsAndFilter() {
    this.podcastSub = this.store.select(selectPodcasts).subscribe((podcasts: PodcastModel[]) => {
      if (podcasts && podcasts.length) {
        this.podcasts = podcasts;
        this.isLoadingForTheFirstTime = false;

        if (!this.filterSub) {
          this.filterSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
            if (!this.filter || !this.filter.beginDate || !this.filter.endDate || !this.filter.interval) {
              this.setDefaultFilter(newFilter);
              this.updatePodcast = this.updateEpisodes = true;
              this.toggleLoading(true, true);
            }

            if (this.isPodcastChanged(newFilter)) {
              this.filter.podcastSeriesId = newFilter.podcastSeriesId;
              this.resetEpisodes();
              this.toggleLoading(true, true);
              if (!this.episodeSub) {
                this.subEpisodes();
              }
              this.updatePodcast = this.updateEpisodes = true;
            }

            if (this.isEpisodesChanged(newFilter)) {
              this.filter.episodeIds = newFilter.episodeIds;
              // we also update the podcast data when episodes changes because when looking at the current day
              // after a bit there is more data to be had on the podcast also
              this.updatePodcast = this.updateEpisodes = true;
            }

            if (this.isBeginDateChanged(newFilter)) {
              this.filter.beginDate = newFilter.beginDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (this.isEndDateChanged(newFilter)) {
              this.filter.endDate = newFilter.endDate;
              this.updatePodcast = this.updateEpisodes = true;
            }
            if (this.isIntervalChanged(newFilter)) {
              this.filter.interval = newFilter.interval;
              this.updatePodcast = this.updateEpisodes = true;
            }

            if (this.updatePodcast && this.filter.podcastSeriesId) {
              const podcast = this.podcasts.find(p => p.seriesId === this.filter.podcastSeriesId);
              if (podcast) {
                this.getPodcastMetrics(podcast);
                this.updatePodcast = false;
              }
            }

            // if episodes were already loaded, update episode metrics with filter change
            if (this.updateEpisodes && this.allPodcastEpisodes && this.filter.episodeIds && this.filter.episodeIds.length > 0) {
              const episodes = filterAllPodcastEpisodes(this.filter, this.allPodcastEpisodes);
              if (episodes && episodes.length) {
                this.getEpisodeMetrics();
                this.updateEpisodes = false;
              }
            }
          });
        }
      }
    });
  }

  subEpisodes() {
    // update episodes separate from filter change when we're waiting on the episodes to load
    this.episodeSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      const episodes = filterAllPodcastEpisodes(this.filter, allEpisodes);
      if (episodes && episodes.length) {
        this.allPodcastEpisodes = episodes;
        if (!this.filter.episodeIds) {
          this.setDefaultEpisodeFilter();
          this.updateEpisodes = true;
        }
        if (this.updateEpisodes && this.filter.episodeIds) {
          if (this.filter.episodeIds.length === 0) {
            this.toggleLoading(this.isPodcastLoading, false);
          } else {
            this.getEpisodeMetrics();
          }
          this.updateEpisodes = false;
        }
      }
    });
  }

  resetEpisodes() {
    this.allPodcastEpisodes = null;
    this.filter.episodeIds = null;
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

  setDefaultFilter(newFilter: FilterModel) {
    // dispatch some default values for the dates and interval
    this.filter = {
      standardRange: TWO_WEEKS,
      range: getRange(TWO_WEEKS),
      beginDate: beginningOfTwoWeeksUTC().toDate(),
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    if (newFilter.standardRange) {
      this.filter.standardRange = newFilter.standardRange;
    }
    if (newFilter.range) {
      this.filter.range = newFilter.range;
    }
    if (newFilter.beginDate) {
      this.filter.beginDate = newFilter.beginDate;
    }
    if (newFilter.endDate) {
      this.filter.endDate = newFilter.endDate;
    }
    if (newFilter.interval) {
      this.filter.interval = newFilter.interval;
    }
    if (newFilter.podcastSeriesId) {
      const routerParams = {
        beginDate: this.filter.beginDate.toISOString(),
        endDate: this.filter.endDate.toISOString(),
        standardRange: this.filter.standardRange,
        range: this.filter.range.join(',')
      };
      // if episodes are on the route, keep them on the route
      // but do not put them on this.filter yet because we need to check for incoming changes
      if (newFilter.episodeIds) {
        routerParams['episodes'] = newFilter.episodeIds.join(',');
      }
      this.router.navigate([newFilter.podcastSeriesId, 'downloads', this.filter.interval.key, routerParams]);
    } else {
      this.store.dispatch(new CastleFilterAction({filter: this.filter}));
    }
  }

  setDefaultEpisodeFilter() {
    const episodes = [];
    this.allPodcastEpisodes.every((episode: EpisodeModel) => {
      episodes.push(episode);
      return !((episode.publishedAt.valueOf() < this.filter.beginDate.valueOf() &&
          episodes.length % 5 === 0) || episodes.length === DownloadsComponent.DONT_BREAK_CASTLE_LIMIT);
    });
    this.filter.episodeIds = episodes.map(e => e.id);
    const routerParams = {episodes: episodes.map(e => e.id).join(',')};
    if (this.filter.range) {
      routerParams['range'] = this.filter.range;
    }
    if (this.filter.standardRange) {
      routerParams['standardRange'] = this.filter.standardRange;
    }
    if (this.filter.beginDate) {
      routerParams['beginDate'] = this.filter.beginDate.toISOString();
    }
    if (this.filter.endDate) {
      routerParams['endDate'] = this.filter.endDate.toISOString();
    }
    this.router.navigate([this.filter.podcastSeriesId, 'downloads', this.filter.interval.key, routerParams]);
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
        podcast: podcast,
        filter: this.filter,
        metricsType: 'downloads',
        metrics: metrics[0]['downloads']
      }));
      this.angulartics2.eventTrack.next({
        action: 'load',
        properties: {
          category: 'Downloads/' + this.filter.interval.name,
          label: podcast.title,
          value: metrics[0]['downloads'].length
        }
      });
    }
  }

  getEpisodeMetrics() {
    this.toggleLoading(this.isPodcastLoading, true);
    this.filter.episodeIds.forEach((episodeId: number) => {
      const episode = this.allPodcastEpisodes.find(e => e.id === episodeId);
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

  isPodcastChanged(state: FilterModel): boolean {
    return state.podcastSeriesId && (!this.filter.podcastSeriesId ||  this.filter.podcastSeriesId !== state.podcastSeriesId);
  }

  isEpisodesChanged(state: FilterModel): boolean {
    return state.episodeIds &&
      (!this.filter.episodeIds ||
      !state.episodeIds.every(id => this.filter.episodeIds.indexOf(id) !== -1) ||
      !this.filter.episodeIds.every(id => state.episodeIds.indexOf(id) !== -1));
  }

  isBeginDateChanged(state: FilterModel): boolean {
    return state.beginDate && (!this.filter.beginDate || this.filter.beginDate.valueOf() !== state.beginDate.valueOf());
  }

  isEndDateChanged(state: FilterModel): boolean {
    return state.endDate && (!this.filter.endDate || this.filter.endDate.valueOf() !== state.endDate.valueOf());
  }

  isIntervalChanged(state: FilterModel): boolean {
    return state.interval && (!this.filter.interval || this.filter.interval.value !== state.interval.value);
  }
}
