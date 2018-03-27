import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { getEpisodePerformanceMetricsEntities, EpisodePerformanceMetricsModel } from '../episode-performance-metrics.reducer';
import { EpisodeModel } from '../episode.reducer';
import { selectSelectedPageEpisodes } from './episode.selectors';

export const selectEpisodePerformanceMetricsState = createSelector(selectAppState, (state: RootState) => state.episodePerformanceMetrics);
export const selectEpisodePerformanceMetricsEntities = createSelector(selectEpisodePerformanceMetricsState,
  getEpisodePerformanceMetricsEntities);

export const selectEpisodePagePerformanceMetrics = createSelector(selectSelectedPageEpisodes, selectEpisodePerformanceMetricsEntities,
  (episodes: EpisodeModel[], entities): EpisodePerformanceMetricsModel[] => {
    return episodes.filter(episode => entities[episode.id]).map(episode => entities[episode.id]);
  });
