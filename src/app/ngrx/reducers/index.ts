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
export { EpisodeModel, EPISODE_PAGE_SIZE } from './episode.reducer';
export { INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY, IntervalModel, IntervalList, FilterModel } from './filter.reducer';

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

export const selectFilter = createSelector(selectAppState, (state: RootState) => state.filter);
export const selectPodcastFilter = createSelector(selectFilter, (filter: FilterModel) => filter.podcastSeriesId);
export const selectPageFilter = createSelector(selectFilter, (filter: FilterModel) => filter.page);
export const selectIntervalFilter = createSelector(selectFilter, (filter: FilterModel) => filter.interval);

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

