import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CastleService } from '../core';
import { EpisodeModel, PodcastModel, EpisodeMetricsModel, PodcastMetricsModel, INTERVAL_DAILY } from '../shared';
import { castlePodcastMetrics, castleEpisodeMetrics } from '../ngrx/actions/castle.action.creator';

@Component({
  selector: 'metrics-downloads',
  template: `
    <prx-spinner *ngIf="isLoading"></prx-spinner>
    <p class="error" *ngIf="error">{{error}}</p>
  `
})
export class DownloadsComponent implements OnChanges/*, OnInit*/ {
  @Input() podcast: PodcastModel;
  episodeStore: Observable<EpisodeModel[]>;
  episodes: EpisodeModel[];
  podcastMetricsStore: Observable<PodcastMetricsModel[]>;
  podcastMetrics: PodcastMetricsModel[];
  episodeMetricsStore: Observable<EpisodeMetricsModel[]>;
  episodeMetrics: EpisodeMetricsModel[];
  isLoading = true;
  error: string;

  constructor(private castle: CastleService, private store: Store<any>) {}

  ngOnChanges() {
    if (this.podcast && this.podcast.episodeIds && this.podcast.episodeIds.length > 0) {
      // normally would select store in constructor and subscribe in ngOnInit,
      // but we don't want to even look at these stores until we have the selected podcast
      if (!this.episodeStore) {
        this.episodeStore = this.store.select('episode');
        this.episodeStore.subscribe((episodes: EpisodeModel[]) => {
          if (this.podcast) {
            this.episodes = episodes.filter((e: EpisodeModel) => e.seriesId === this.podcast.seriesId);
          }
        });
      }

      if (!this.podcastMetricsStore) {
        this.podcastMetricsStore = this.store.select('podcastMetrics');
        this.podcastMetricsStore.subscribe((podcastMetrics: PodcastMetricsModel[]) => {
          if (this.podcast) {
            this.podcastMetrics = podcastMetrics.filter((p: PodcastMetricsModel) => p.seriesId === this.podcast.seriesId);
          }
        });
      }

      if (!this.episodeMetricsStore) {
        this.episodeMetricsStore = this.store.select('episodeMetrics');
        this.episodeMetricsStore.subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
          if (this.podcast) {
            this.episodeMetrics = episodeMetrics.filter((e: EpisodeMetricsModel) => e.seriesId === this.podcast.seriesId);
          }
        });
      }

      this.castle.followList('prx:podcast-downloads', {
        id: this.podcast.feederId,
        from: '2017-08-27', // TODO
        to: '2017-09-08',
        interval: INTERVAL_DAILY.value
      }).subscribe(
        metrics => this.setPodcastMetrics(metrics),
        err => {
          this.isLoading = false;
          if (err.name === 'HalHttpError' && err.status === 401) {
            this.error = 'An error occurred while requesting podcast metrics on ' + this.podcast.title;
            console.error(err);
          } else {
            this.error = this.podcast.title + ' podcast has no download metrics.';
          }
        }
      );
    }

    if (this.podcast && this.episodes) {
      this.episodes.slice(0, 5).forEach((episode: EpisodeModel) => {
        this.castle.followList('prx:episode-downloads', {
          guid: episode.guid,
          from: '2017-08-27', // TODO
          to: '2017-09-08',
          interval: INTERVAL_DAILY.value
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
  }

  setPodcastMetrics(metrics: any) {
    if (metrics && metrics.length > 0 && metrics[0]['downloads']) {
      this.store.dispatch(castlePodcastMetrics(this.podcast, INTERVAL_DAILY, 'downloads', metrics[0]['downloads']));
    }
  }

  setEpisodeMetrics(episode: EpisodeModel, metrics: any) {
    this.isLoading = false;
    if (metrics && metrics.length > 0 && metrics[0]['downloads']) {
      this.store.dispatch(castleEpisodeMetrics(this.podcast, episode, INTERVAL_DAILY, 'downloads', metrics[0]['downloads']));
    }
  }
}
