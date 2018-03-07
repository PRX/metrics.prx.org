import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { getEpisodePerformanceMetricsEntities, EpisodePerformanceMetricsModel } from '../episode-performance-metrics.reducer';
import { EpisodeModel } from '../episode.reducer';
import { selectRecentEpisode } from './recent-episode.selectors';
import { selectSelectedPageEpisodes } from './episode.selectors';

export const selectEpisodePerforamnceMetricsState = createSelector(selectAppState, (state: RootState) => state.episodePerformanceMetrics);
export const selectEpisodePerformanceMetricsEntities = createSelector(selectEpisodePerforamnceMetricsState, getEpisodePerformanceMetricsEntities);
export const selectRecentEpisodePerformanceMetrics = createSelector(selectRecentEpisode, selectEpisodePerformanceMetricsEntities,
  (episode: EpisodeModel, entities): EpisodePerformanceMetricsModel => {
    if (episode) {
      return entities[episode.id];
    }
  });
export const selectEpisodePagePerformanceMetrics = createSelector(selectSelectedPageEpisodes, selectEpisodePerformanceMetricsEntities,
  (episodes: EpisodeModel[], entities): EpisodePerformanceMetricsModel[] => {
    return episodes.filter(episode => entities[episode.id]).map(episode => entities[episode.id]);
  });
