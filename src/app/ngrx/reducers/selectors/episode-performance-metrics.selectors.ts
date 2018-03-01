import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { getEpisodePerformanceMetricsEntities } from '../episode-performance-metrics.reducer';
import { EpisodeModel } from '../episode.reducer';
import { selectRecentEpisode } from './recent-episode.selectors';

export const selectEpisodePerforamnceMetricsState = createSelector(selectAppState, (state: RootState) => state.episodePerformanceMetrics);
export const selectEpisodePerformanceMetricsEntities = createSelector(selectEpisodePerforamnceMetricsState, getEpisodePerformanceMetricsEntities);
export const selectRecentEpisodePerformanceMetrics = createSelector(selectRecentEpisode, selectEpisodePerformanceMetricsEntities,
  (episode: EpisodeModel, entities) => {
    if (episode) {
      return entities[episode.id];
    }
  });
