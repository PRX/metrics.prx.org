import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CastleService } from '../core';
import { EpisodeModel, EpisodeMetricsModel, PodcastMetricsModel, INTERVAL_DAILY, FilterModel } from '../ngrx/model';
import { castlePodcastMetrics, castleEpisodeMetrics, castleFilter } from '../ngrx/actions/castle.action.creator';

@Component({
  selector: 'metrics-downloads',
  template: `
    <prx-spinner *ngIf="isLoading"></prx-spinner>
    <p class="error" *ngIf="error">{{error}}</p>
    <metrics-downloads-chart *ngIf="podcastMetrics && podcastMetrics.length > 0"></metrics-downloads-chart>
  `
})
export class DownloadsComponent implements OnInit {
  episodeStore: Observable<EpisodeModel[]>;
  allEpisodes: EpisodeModel[];
  podcastMetricsStore: Observable<PodcastMetricsModel[]>;
  podcastMetrics: PodcastMetricsModel[];
  episodeMetricsStore: Observable<EpisodeMetricsModel[]>;
  episodeMetrics: EpisodeMetricsModel[];
  filterStore: Observable<FilterModel>;
  filter: FilterModel;
  isLoading = true;
  error: string;

  constructor(private castle: CastleService, public store: Store<any>) {
    this.filterStore = store.select('filter');
  }

  ngOnInit() {
    // dispatch some default values for the dates and interval
    const today = new Date();
    const utcEndDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
    const utcBeginDate = new Date(utcEndDate.valueOf() - (14 * 24 * 60 * 60 * 1000) + 1);// 14 days prior at 0:0:0
    this.filter = {
      beginDate: utcBeginDate,
      endDate: utcEndDate,
      interval: INTERVAL_DAILY
    };
    this.store.dispatch(castleFilter(this.filter));

    this.filterStore.subscribe((state: FilterModel) => {
      let changedFilter = false;
      if (state.podcast && (!this.filter.podcast ||  this.filter.podcast.seriesId !== state.podcast.seriesId)) {
        this.filter.podcast = state.podcast;
        changedFilter = true;

        // we don't want to even look at these stores until we have the selected podcast
        if (!this.episodeStore) {
          this.episodeStore = this.store.select('episode');
          this.episodeStore.subscribe((episodes: EpisodeModel[]) => {
            this.allEpisodes = episodes.filter((e: EpisodeModel) => e.seriesId === state.podcast.seriesId);
            if (this.allEpisodes.length > 0) {
              this.store.dispatch(castleFilter({episodes: this.allEpisodes.length > 5 ? this.allEpisodes.slice(0, 5) : this.allEpisodes}));
            }
          });
        }

        if (!this.podcastMetricsStore) {
          this.podcastMetricsStore = this.store.select('podcastMetrics');
          this.podcastMetricsStore.subscribe((podcastMetrics: PodcastMetricsModel[]) => {
            // TODO: figure out selectors with ngrx so I can put this filtering in a common selector
            this.podcastMetrics = podcastMetrics.filter((p: PodcastMetricsModel) => p.seriesId === state.podcast.seriesId);
          });
        }

        if (state.episodes && !this.episodeMetricsStore) {
          this.episodeMetricsStore = this.store.select('episodeMetrics');
          this.episodeMetricsStore.subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
            this.episodeMetrics = episodeMetrics.filter((e: EpisodeMetricsModel) => {
              return e.seriesId === state.podcast.seriesId && state.episodes.map(ep => ep.id).indexOf(e.id) !== -1;
            });
          });
        }
      }
      if (state.beginDate && (!this.filter.beginDate || this.filter.beginDate.valueOf() !== state.beginDate.valueOf())) {
        this.filter.beginDate = state.beginDate;
        changedFilter = true;
      }
      if (state.endDate && (!this.filter.endDate || this.filter.endDate.valueOf() !== state.endDate.valueOf())) {
        this.filter.endDate = state.endDate;
        changedFilter = true;
      }
      if (state.interval && (!this.filter.interval || this.filter.interval.value !== state.interval.value)) {
        this.filter.interval = state.interval;
        changedFilter = true;
      }

      if (changedFilter && this.filter.podcast) {
        this.castle.followList('prx:podcast-downloads', {
          id: this.filter.podcast.feederId,
          from: this.filter.beginDate.toISOString(),
          to: this.filter.endDate.toISOString(),
          interval: this.filter.interval.value
        }).subscribe(
          metrics => this.setPodcastMetrics(metrics),
          err => {
            this.isLoading = false;
            if (err.name === 'HalHttpError' && err.status === 401) {
              this.error = 'An error occurred while requesting podcast metrics on ' + this.filter.podcast.title;
              console.error(err);
            } else {
              this.error = this.filter.podcast.title + ' podcast has no download metrics.';
            }
          }
        );
      }

      if (state.episodes &&
        (!this.filter.episodes ||
          !state.episodes.map(e => e.id).every(id => this.filter.episodes.map(e => e.id).indexOf(id) !== -1))) {
        this.filter.episodes = state.episodes;
        changedFilter = true;
      }

      if (changedFilter && this.filter.episodes) {
        this.filter.episodes.forEach((episode: EpisodeModel) => {
          this.castle.followList('prx:episode-downloads', {
            guid: episode.guid,
            from: this.filter.beginDate.toISOString(),
            to: this.filter.endDate.toISOString(),
            interval: this.filter.interval.value
          }).subscribe(
            metrics => this.setEpisodeMetrics(episode, metrics),
            err => {
              this.isLoading = false;
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
    });
  }

  setPodcastMetrics(metrics: any) {
    if (metrics && metrics.length && metrics[0]['downloads']) {
      this.store.dispatch(castlePodcastMetrics(this.filter.podcast, this.filter, 'downloads', metrics[0]['downloads']));
    }
  }

  setEpisodeMetrics(episode: EpisodeModel, metrics: any) {
    this.isLoading = false;
    if (metrics && metrics.length && metrics[0]['downloads']) {
      this.store.dispatch(castleEpisodeMetrics(episode, this.filter, 'downloads', metrics[0]['downloads']));
    }
  }
}
