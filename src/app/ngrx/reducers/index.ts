import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { FilterReducer } from './filter.reducer';
import { PodcastReducer } from './podcast.reducer';
import { EpisodeReducer } from './episode.reducer';
import { PodcastMetricsReducer } from './podcast-metrics.reducer';
import { EpisodeMetricsReducer } from './episode-metrics.reducer';
import { EpisodeModel, FilterModel, PodcastMetricsModel, EpisodeMetricsModel } from '../model';
import { PodcastState, getPodcastEntities } from './podcast.reducer';
import { EpisodeState, getEpisodeEntities } from './episode.reducer';

export { PodcastModel } from './podcast.reducer';
export { EpisodeModel } from './episode.reducer';

export interface RootState {
  filter: FilterModel;
  podcasts: PodcastState;
  episodes: EpisodeState;
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

export const selectPodcastFilter = createSelector(selectAppState, (state: RootState) => state.filter ? state.filter.podcastSeriesId : undefined);

export const selectEpisodeFilter = createSelector(selectAppState, (state: RootState) => state.filter ? state.filter.episodeIds : undefined);

export const selectIntervalFilter = createSelector(selectAppState, (state: RootState) => state.filter ? state.filter.interval : undefined);

export const selectPodcastState = createSelector(selectAppState, (state: RootState) => state.podcasts);
export const selectPodcastEntities = createSelector(selectPodcastState, getPodcastEntities);
export const selectPodcasts = createSelector(selectPodcastEntities, entities => {
  return Object.keys(entities).map(seriesId => entities[parseInt(seriesId, 10)]);
});

export const selectEpisodeState = createSelector(selectAppState, (state: RootState) => state.episodes);
export const selectEpisodeEntities = createSelector(selectEpisodeState, getEpisodeEntities);
export const selectEpisodes = createSelector(selectEpisodeEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const selectPodcastMetrics = createFeatureSelector<PodcastMetricsModel[]>('podcastMetrics');

export const selectEpisodeMetrics = createFeatureSelector<EpisodeMetricsModel[]>('episodeMetrics');

