import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { FilterReducer } from './filter.reducer';
import { PodcastReducer } from './podcast.reducer';
import { EpisodeReducer } from './episode.reducer';
import { PodcastMetricsReducer } from './podcast-metrics.reducer';
import { EpisodeMetricsReducer } from './episode-metrics.reducer';
import { PodcastModel, EpisodeModel, FilterModel, MetricsType, PodcastMetricsModel, EpisodeMetricsModel } from '../model';

export interface State {
  filter: FilterModel;
  podcasts: PodcastModel[];
  episodes: EpisodeModel[];
  podcastMetrics: PodcastMetricsModel[];
  episodeMetrics: EpisodeMetricsModel[];
}

export const reducers: ActionReducerMap<State> = {
  filter: FilterReducer,
  podcasts: PodcastReducer,
  episodes: EpisodeReducer,
  podcastMetrics: PodcastMetricsReducer,
  episodeMetrics: EpisodeMetricsReducer
};

export const selectAppState = (state: State) => state;

export const selectFilter = createFeatureSelector<FilterModel>('filter');

export const selectPodcasts = createFeatureSelector<PodcastModel[]>('podcasts');

export const selectEpisodes = createFeatureSelector<EpisodeModel[]>('episodes');

export const selectPodcastMetrics = createFeatureSelector<PodcastMetricsModel[]>('podcastMetrics');

export const selectEpisodeMetrics = createFeatureSelector<EpisodeMetricsModel[]>('episodeMetrics');

export const filterPodcasts = (filter: FilterModel, podcasts: PodcastModel[]): PodcastModel => {
  if (filter.podcast && podcasts) {
    const matches = podcasts.filter(p => p.seriesId === filter.podcast.seriesId);
    if (matches && matches.length) {
      return matches[0]; // only one entry should match the series id
    }
  }
};

export const filterAllPodcastEpisodes = (filter: FilterModel, episodes: EpisodeModel[]) => {
  if (filter.podcast && episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcast.seriesId);
  }
};

export const filterEpisodes = (filter: FilterModel, episodes: EpisodeModel[]) => {
  if (filter.podcast && filter.episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcast.seriesId &&
      filter.episodes.map(e => e.id).indexOf(episode.id) !== -1);
  }
};

export const filterPodcastMetrics = (filter: FilterModel, podcastMetrics: PodcastMetricsModel[]): PodcastMetricsModel => {
  if (filter.podcast && filter.beginDate && filter.endDate && filter.interval && podcastMetrics) {
    const metrics = podcastMetrics.filter(metric => metric.seriesId === filter.podcast.seriesId);
    if (metrics && metrics.length) {
      return metrics[0]; // only one entry should match the series id
    }
  }
};

export const metricsData = (filter: FilterModel, metrics: PodcastMetricsModel | EpisodeMetricsModel, metricsType: MetricsType) => {
  const metricsProperty = filter.interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
  return metrics[metricsProperty];
};

export const filterEpisodeMetrics = (filter: FilterModel, episodeMetrics: EpisodeMetricsModel[]): EpisodeMetricsModel[] => {
  if (filter.podcast && filter.episodes && filter.beginDate && filter.endDate && filter.interval && episodeMetrics) {
    return episodeMetrics.filter(metric => metric.seriesId === filter.podcast.seriesId &&
      filter.episodes.map(e => e.id).indexOf(metric.id) !== -1);
  }
};
