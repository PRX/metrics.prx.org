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
  podcastStoreSub: Subscription;
  podcasts: PodcastModel[];
  episodeStoreSub: Subscription;
  allPodcastEpisodes: EpisodeModel[];
  filterStoreSub: Subscription;
  filter: FilterModel;
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

    this.podcastStoreSub = this.store.select(selectPodcasts).subscribe((podcasts: PodcastModel[]) => {
      if (podcasts && podcasts.length) {
        this.podcasts = podcasts;
        this.isLoadingForTheFirstTime = false;

        if (!this.filterStoreSub) {
          this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
            if (!this.filter || !this.filter.beginDate || !this.filter.endDate || !this.filter.interval) {
              this.setDefaultFilter(newFilter);
            }

            let changedFilter = false;
            if (this.isPodcastChanged(newFilter)) {
              this.toggleLoading(true, true);
              this.filter.podcastSeriesId = newFilter.podcastSeriesId;
              changedFilter = true;

              // we don't want to even look at this store until we have the selected podcast
              if (!this.episodeStoreSub) {
                this.episodeStoreSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
                  const episodes = filterAllPodcastEpisodes(this.filter, allEpisodes);
                  if (episodes && episodes.length) {
                    this.allPodcastEpisodes = episodes;
                    this.setDefaultEpisodeFilter();
                  }
                });
              }
            }
            if (this.isBeginDateChanged(newFilter)) {
              this.filter.beginDate = newFilter.beginDate;
              changedFilter = true;
            }
            if (this.isEndDateChanged(newFilter)) {
              this.filter.endDate = newFilter.endDate;
              changedFilter = true;
            }
            if (this.isIntervalChanged(newFilter)) {
              this.filter.interval = newFilter.interval;
              changedFilter = true;
            }

            if (this.isEpisodesChanged(newFilter)) {
              this.filter.episodes = newFilter.episodes;
              changedFilter = true;
            }

            if (changedFilter && this.filter.podcastSeriesId && this.podcasts) {
              const podcast = this.podcasts.find(p => p.seriesId === this.filter.podcastSeriesId);
              if (podcast) {
                this.getPodcastMetrics(podcast);
              }
            }

            if (changedFilter && this.filter.episodes && this.filter.episodes.length > 0) {
              this.getEpisodeMetrics();
            }
          });
        }
      }
    });
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
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.episodeStoreSub) { this.episodeStoreSub.unsubscribe(); }
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
    // override the defaults if we have incoming filter
    // I would just add a ...newFilter above, but I do not want the podcast or episode params here just yet
    // gotta have podcast and episodes come back down thru the router effects filter mechanism
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
      this.router.navigate([newFilter.podcastSeriesId, 'downloads', this.filter.interval.key, routerParams]);
    } else {
      this.store.dispatch(new CastleFilterAction({filter: this.filter}));
    }
  }

  setDefaultEpisodeFilter() {
    const episodes = [];
    this.allPodcastEpisodes.every((episode: EpisodeModel) => {
      episodes.push(episode);
      if ((episode.publishedAt.valueOf() < this.filter.beginDate.valueOf() &&
          episodes.length % 5 === 0) || episodes.length === DownloadsComponent.DONT_BREAK_CASTLE_LIMIT) {
        return false;
      } else {
        return true;
      }
    });
    this.store.dispatch(new CastleFilterAction({filter: {episodes}}));
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
    this.filter.episodes.forEach((episode: EpisodeModel) => {
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
    return state.episodes &&
      (!this.filter.episodes ||
      !state.episodes.map(e => e.id).every(id => this.filter.episodes.map(e => e.id).indexOf(id) !== -1) ||
      !this.filter.episodes.map(e => e.id).every(id => state.episodes.map(e => e.id).indexOf(id) !== -1));
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
