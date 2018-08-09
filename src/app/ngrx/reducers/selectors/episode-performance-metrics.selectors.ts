import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { getEpisodePerformanceMetricsEntities, EpisodePerformanceMetricsModel } from '../episode-performance-metrics.reducer';
import { Episode } from '../models/episode.model';
import { selectRoutedPageEpisodes } from './episode.selectors';

export const selectEpisodePerformanceMetricsState = createSelector(selectAppState, (state: RootState) => state.episodePerformanceMetrics);
export const selectEpisodePerformanceMetricsEntities = createSelector(selectEpisodePerformanceMetricsState,
  getEpisodePerformanceMetricsEntities);

export const selectRoutedEpisodePagePerformanceMetrics = createSelector(selectRoutedPageEpisodes, selectEpisodePerformanceMetricsEntities,
  (episodes: Episode[], entities): EpisodePerformanceMetricsModel[] => {
    return episodes.filter(episode => entities[episode.guid]).map(episode => entities[episode.guid]);
  });
