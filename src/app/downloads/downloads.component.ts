import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Angulartics2 } from 'angulartics2';
import { CastleService } from '../core';
import { EpisodeModel, INTERVAL_DAILY, FilterModel, TWO_WEEKS } from '../ngrx/model';
import { CastleFilterAction, CastlePodcastMetricsAction, CastleEpisodeMetricsAction } from '../ngrx/actions';
import { selectFilter, selectEpisodes } from '../ngrx/reducers';
import { filterAllPodcastEpisodes } from '../shared/util/metrics.util';
import { beginningOfTwoWeeksUTC, endOfTodayUTC, getRange } from '../shared/util/date.util';

@Component({
  selector: 'metrics-downloads',
  template: `
    <prx-spinner *ngIf="isPodcastLoading || isEpisodeLoading" overlay="true" loadingMessage="Please wait..."></prx-spinner>
    <section class="controls">
      <metrics-filter></metrics-filter>
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
  episodeStoreSub: Subscription;
  allPodcastEpisodes: EpisodeModel[];
  filterStoreSub: Subscription;
  filter: FilterModel;
  isPodcastLoading = true;
  isEpisodeLoading = true;
  errors: string[] = [];

  constructor(private castle: CastleService,
              public store: Store<any>,
              private angulartics2: Angulartics2) {}

  ngOnInit() {
    this.setDefaultFilter();
    this.toggleLoading(true, true);

    this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      let changedFilter = false;
      if (this.isPodcastChanged(newFilter)) {
        this.toggleLoading(true, true);
        this.filter.podcast = newFilter.podcast;
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

      if (changedFilter && this.filter.podcast) {
        this.getPodcastMetrics();
      }

      if (changedFilter && this.filter.episodes && this.filter.episodes.length > 0) {
        this.getEpisodeMetrics();
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

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.episodeStoreSub) { this.episodeStoreSub.unsubscribe(); }
  }

  setDefaultFilter() {
    // dispatch some default values for the dates and interval
    this.filter = {
      when: TWO_WEEKS,
      range: getRange(TWO_WEEKS),
      beginDate: beginningOfTwoWeeksUTC().toDate(),
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    this.store.dispatch(new CastleFilterAction({filter: this.filter}));
  }

  setDefaultEpisodeFilter() {
    if (!this.filter.episodes ||
        this.filter.episodes.length < 5) {
      // init with the first five (or less) episodes
      const episodes = this.allPodcastEpisodes.length > 5 ? this.allPodcastEpisodes.slice(0, 5) : this.allPodcastEpisodes;
      this.store.dispatch(new CastleFilterAction({filter: {episodes}}));
    }
  }

  getPodcastMetrics() {
    this.toggleLoading(true);
    this.castle.followList('prx:podcast-downloads', {
      id: this.filter.podcast.feederId,
      from: this.filter.beginDate.toISOString(),
      to: this.filter.endDate.toISOString(),
      interval: this.filter.interval.value
    }).subscribe(
      metrics => this.setPodcastMetrics(metrics),
      err => {
        this.toggleLoading(false);
        const type = err.status === 401 ? 'authorization' : 'unknown';
        this.errors.push(`An ${type} error occurred while requesting podcast metrics on ${this.filter.podcast.title}`);
      }
    );
  }

  setPodcastMetrics(metrics: any) {
    this.toggleLoading(false);
    if (metrics && metrics.length && metrics[0]['downloads']) {
      this.store.dispatch(new CastlePodcastMetricsAction({
        podcast: this.filter.podcast,
        filter: this.filter,
        metricsType: 'downloads',
        metrics: metrics[0]['downloads']
      }));
      this.angulartics2.eventTrack.next({
        action: this.filter.interval.name,
        properties: {category: 'Downloads', label: this.filter.podcast.title, value: metrics[0]['downloads'].length}
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
          const type = err.status === 401 ? 'authorization' : 'unknown';
          this.errors.push(`An ${type} error occurred while requesting episode metrics on ${episode.title}`);
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
    return state.podcast && (!this.filter.podcast ||  this.filter.podcast.seriesId !== state.podcast.seriesId);
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
