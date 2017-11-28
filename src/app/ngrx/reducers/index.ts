import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { FilterReducer } from './filter.reducer';
import { PodcastReducer } from './podcast.reducer';
import { EpisodeReducer } from './episode.reducer';
import { PodcastMetricsReducer } from './podcast-metrics.reducer';
import { EpisodeMetricsReducer } from './episode-metrics.reducer';
import { PodcastModel, EpisodeModel, FilterModel, PodcastMetricsModel, EpisodeMetricsModel } from '../model';

export interface RootState {
  filter: FilterModel;
  podcasts: PodcastModel[];
  episodes: EpisodeModel[];
  podcastMetrics: PodcastMetricsModel[];
  episodeMetrics: EpisodeMetricsModel[];
}

export const reducers: ActionReducerMap<RootState> = {
  filter: FilterReducer,
  podcasts: PodcastReducer,
  episodes: EpisodeReducer,
  podcastMetrics: PodcastMetricsReducer,
  episodeMetrics: EpisodeMetricsReducer
};

export const selectAppState = (state: RootState) => state;

export const selectFilter = createFeatureSelector<FilterModel>('filter');

// these selectors off the selectAppState selector should only emit changes when that slice of the filter state changes, handy!
export const selectPodcastFilter = createSelector(selectAppState, (state: RootState) => state.filter ? state.filter.podcastSeriesId : undefined);

export const selectEpisodeFilter = createSelector(selectAppState, (state: RootState) => state.filter ? state.filter.episodeIds : undefined);

export const selectIntervalFilter = createSelector(selectAppState, (state: RootState) => state.filter ? state.filter.interval : undefined);

export const selectPodcasts = createFeatureSelector<PodcastModel[]>('podcasts');

export const selectEpisodes = createFeatureSelector<EpisodeModel[]>('episodes');

export const selectPodcastMetrics = createFeatureSelector<PodcastMetricsModel[]>('podcastMetrics');

export const selectEpisodeMetrics = createFeatureSelector<EpisodeMetricsModel[]>('episodeMetrics');

