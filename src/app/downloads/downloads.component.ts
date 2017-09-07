import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CastleService } from '../core';
import { EpisodeModel, PodcastModel, EpisodeMetricsModel, PodcastMetricsModel, INTERVAL_DAILY } from '../shared';
import { castlePodcastMetrics, castleEpisodeMetrics } from '../ngrx/actions/castle.action.creator';

@Component({
  selector: 'metrics-downloads',
  template: `
  `
})
export class DownloadsComponent implements OnChanges, OnInit {
  @Input() podcast: PodcastModel;
  episodeStore: Observable<EpisodeModel[]>;
  episodes: EpisodeModel[];
  podcastMetricsStore: Observable<PodcastMetricsModel[]>;
  podcastMetrics: PodcastMetricsModel[];
  episodeMetricsStore: Observable<EpisodeMetricsModel[]>;
  episodeMetrics: EpisodeMetricsModel[];
  error: string;

  constructor(private castle: CastleService, private store: Store<any>) {
    this.episodeStore = store.select('episode');
    this.podcastMetricsStore = store.select('podcastMetrics');
    this.episodeMetricsStore = store.select('episodeMetrics');
  }

  ngOnInit() {
    this.episodeStore.subscribe((episodes: EpisodeModel[]) => {
      if (this.podcast) {
        this.episodes = episodes.filter((e: EpisodeModel) => e.seriesId === this.podcast.seriesId);
      }
    });
    this.podcastMetricsStore.subscribe((podcastMetrics: PodcastMetricsModel[]) => {
      if (this.podcast) {
        this.podcastMetrics = podcastMetrics.filter((p: PodcastMetricsModel) => p.seriesId === this.podcast.seriesId);
      }
    });
    this.episodeMetricsStore.subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      if (this.podcast) {
        this.episodeMetrics = episodeMetrics.filter((e: EpisodeMetricsModel) => e.seriesId === this.podcast.seriesId);
      }
    });
  }

  ngOnChanges() {
    if (this.podcast && this.podcast.episodeIds && this.podcast.episodeIds.length > 0) {
      this.castle.followList('prx:podcast-downloads', {
        id: this.podcast.feederId,
        from: '2017-08-27', // TODO
        to: '2017-09-08',
        interval: INTERVAL_DAILY.value
      }).subscribe(
        metrics => this.setPodcastMetrics(metrics),
        err => {
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
      this.episodes.forEach((episode: EpisodeModel) => {
        this.castle.followList('prx:episode-downloads', {
          guid: episode.guid,
          from: '2017-08-27', // TODO
          to: '2017-09-08',
          interval: INTERVAL_DAILY.value
        }).subscribe(
          metrics => this.setEpisodeMetrics(episode, metrics),
          err => {
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
    if (metrics && metrics.length > 0 && metrics[0]['downloads'] && metrics[0]['downloads'].length > 0) {
      this.store.dispatch(castlePodcastMetrics(this.podcast, INTERVAL_DAILY, 'downloads', metrics[0]['downloads']));
    }
  }

  setEpisodeMetrics(episode: EpisodeModel, metrics: any) {
    if (metrics && metrics.length > 0 && metrics[0]['downloads'] && metrics[0]['downloads'].length > 0) {
      this.store.dispatch(castleEpisodeMetrics(this.podcast, episode, INTERVAL_DAILY, 'downloads', metrics[0]['downloads']));
    }
  }
}
