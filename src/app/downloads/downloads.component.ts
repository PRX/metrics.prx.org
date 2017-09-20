import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { CastleService } from '../core';
import { EpisodeModel, EpisodeMetricsModel, PodcastMetricsModel, INTERVAL_DAILY, FilterModel } from '../ngrx/model';
import { castlePodcastMetrics, castleEpisodeMetrics, castleFilter } from '../ngrx/actions/castle.action.creator';

@Component({
  selector: 'metrics-downloads',
  template: `
    <prx-spinner *ngIf="isPodcastLoading || isEpisodeLoading"></prx-spinner>
    <metrics-downloads-chart *ngIf="podcastMetrics && podcastMetrics.length > 0"></metrics-downloads-chart>
    <p class="error" *ngIf="error">{{error}}</p>
  `,
  styleUrls: ['downloads.component.css']
})
export class DownloadsComponent implements OnInit, OnDestroy {
  episodeStoreSub: Subscription;
  allEpisodes: EpisodeModel[];
  podcastMetricsStoreSub: Subscription;
  podcastMetrics: PodcastMetricsModel[];
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[];
  filterStoreSub: Subscription;
  filter: FilterModel;
  isPodcastLoading = true;
  isEpisodeLoading = true;
  error: string;

  constructor(private castle: CastleService, public store: Store<any>) {
  }

  ngOnInit() {
    this.setDefaultFilter();

    this.filterStoreSub = this.store.select('filter').subscribe((state: FilterModel) => {
      let changedFilter = false;
      if (this.isPodcastChanged(state)) {
        this.filter.podcast = state.podcast;
        changedFilter = true;

        // we don't want to even look at these stores until we have the selected podcast
        if (!this.episodeStoreSub) {
          this.episodeStoreSub = this.store.select('episode').subscribe((episodes: EpisodeModel[]) => {
            this.allEpisodes = episodes.filter((e: EpisodeModel) => e.seriesId === state.podcast.seriesId);
            if (this.allEpisodes.length > 0) {
              this.store.dispatch(castleFilter({episodes: this.allEpisodes.length > 5 ? this.allEpisodes.slice(0, 5) : this.allEpisodes}));
            }
          });
        }

        if (!this.podcastMetricsStoreSub) {
          this.podcastMetricsStoreSub = this.store.select('podcastMetrics').subscribe((podcastMetrics: PodcastMetricsModel[]) => {
            // TODO: figure out selectors with ngrx so I can put this filtering in a common selector
            this.podcastMetrics = podcastMetrics.filter((p: PodcastMetricsModel) => p.seriesId === state.podcast.seriesId);
          });
        }

        if (state.episodes && !this.episodeMetricsStoreSub) {
          this.episodeMetricsStoreSub = this.store.select('episodeMetrics').subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
            this.episodeMetrics = episodeMetrics.filter((e: EpisodeMetricsModel) => {
              return e.seriesId === state.podcast.seriesId && state.episodes.map(ep => ep.id).indexOf(e.id) !== -1;
            });
          });
        }
      }
      if (this.isBeginDateChanged(state)) {
        this.filter.beginDate = state.beginDate;
        changedFilter = true;
      }
      if (this.isEndDateChanged(state)) {
        this.filter.endDate = state.endDate;
        changedFilter = true;
      }
      if (this.isIntervalChanged(state)) {
        this.filter.interval = state.interval;
        changedFilter = true;
      }

      if (changedFilter && this.filter.podcast) {
        this.getPodcastMetrics();
      }

      if (this.isEpisodesChanged(state)) {
        this.filter.episodes = state.episodes;
        changedFilter = true;
      }

      if (changedFilter && this.filter.episodes) {
        this.getEpisodeMetrics();
      }
    });
  }

  ngOnDestroy() {
    this.filterStoreSub.unsubscribe();
    this.episodeStoreSub.unsubscribe();
    this.podcastMetricsStoreSub.unsubscribe();
    this.episodeMetricsStoreSub.unsubscribe();
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
    this.store.dispatch(castleFilter(this.filter));
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
      this.store.dispatch(castlePodcastMetrics(this.filter.podcast, this.filter, 'downloads', metrics[0]['downloads']));
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
      this.store.dispatch(castleEpisodeMetrics(episode, this.filter, 'downloads', metrics[0]['downloads']));
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
