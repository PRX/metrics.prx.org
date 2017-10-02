import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { CastleService } from '../core';
import { EpisodeModel, INTERVAL_DAILY, FilterModel } from '../ngrx/model';
import { CastleFilterAction, CastlePodcastMetricsAction, CastleEpisodeMetricsAction } from '../ngrx/actions';
import { selectFilter, selectEpisodes } from '../ngrx/reducers';
import { filterAllPodcastEpisodes } from '../shared/util/metrics.util';

@Component({
  selector: 'metrics-downloads',
  template: `
    <section class="controls">
      <metrics-interval></metrics-interval>
      <div class="bar"></div>
      <metrics-canned-range></metrics-canned-range>
      <metrics-date-range></metrics-date-range>
      <div class="bar"></div>
      <metrics-episodes></metrics-episodes>
    </section>
    <section class="content">
      <prx-spinner *ngIf="isPodcastLoading || isEpisodeLoading"></prx-spinner>
      <metrics-downloads-chart></metrics-downloads-chart>
      <p class="error" *ngIf="error">{{error}}</p>
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
  error: string;

  constructor(private castle: CastleService, public store: Store<any>) {}

  ngOnInit() {
    this.setDefaultFilter();

    this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      let changedFilter = false;
      if (this.isPodcastChanged(newFilter)) {
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

      if (changedFilter && this.filter.podcast) {
        this.getPodcastMetrics();
      }

      if (this.isEpisodesChanged(newFilter)) {
        this.filter.episodes = newFilter.episodes;
        changedFilter = true;
      }

      if (changedFilter && this.filter.episodes && this.filter.episodes.length > 0) {
        this.getEpisodeMetrics();
      }
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.episodeStoreSub) { this.episodeStoreSub.unsubscribe(); }
  }

  setDefaultFilter() {
    // dispatch some default values for the dates and interval
    const today = new Date();
    const utcEndDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
    const utcBeginDate = new Date(utcEndDate.valueOf() - (14 * 24 * 60 * 60 * 1000) + 1); // 14 days prior at 0:0:0
    this.filter = {
      beginDate: utcBeginDate,
      endDate: utcEndDate,
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
    this.isPodcastLoading = true;
    this.castle.followList('prx:podcast-downloads', {
      id: this.filter.podcast.feederId,
      from: this.filter.beginDate.toISOString(),
      to: this.filter.endDate.toISOString(),
      interval: this.filter.interval.value
    }).subscribe(
      metrics => this.setPodcastMetrics(metrics),
      err => {
        this.isPodcastLoading = false;
        if (err.name === 'HalHttpError' && err.status === 401) {
          this.error = 'An error occurred while requesting podcast metrics on ' + this.filter.podcast.title;
          console.error(err);
        } else {
          this.error = this.filter.podcast.title + ' podcast has no download metrics.';
        }
      }
    );
  }

  setPodcastMetrics(metrics: any) {
    this.isPodcastLoading = false;
    if (metrics && metrics.length && metrics[0]['downloads']) {
      this.store.dispatch(new CastlePodcastMetricsAction({
        podcast: this.filter.podcast,
        filter: this.filter,
        metricsType: 'downloads',
        metrics: metrics[0]['downloads']
      }));
    }
  }

  getEpisodeMetrics() {
    this.isEpisodeLoading = true;
    this.filter.episodes.forEach((episode: EpisodeModel) => {
      this.castle.followList('prx:episode-downloads', {
        guid: episode.guid,
        from: this.filter.beginDate.toISOString(),
        to: this.filter.endDate.toISOString(),
        interval: this.filter.interval.value
      }).subscribe(
        metrics => this.setEpisodeMetrics(episode, metrics),
        err => {
          this.isEpisodeLoading = false;
          if (err.name === 'HalHttpError' && err.status === 401) {
            this.error = 'An error occurred while requesting episode metrics on' + episode.title;
            console.error(err);
          } else {
            this.error = episode.title + ' episode has no download metrics.';
          }
        }
      );
    });
  }

  setEpisodeMetrics(episode: EpisodeModel, metrics: any) {
    this.isEpisodeLoading = false;
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
      !state.episodes.map(e => e.id).every(id => this.filter.episodes.map(e => e.id).indexOf(id) !== -1));
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
