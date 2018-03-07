import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { selectPodcastRoute } from './router.selectors';
import { getPodcastPerformanceMetricsEntities } from '../podcast-performance-metrics.reducer';

export const selectPodcastPerformanceMetricsState = createSelector(selectAppState, (state: RootState) => state.podcastPerformanceMetrics);
export const selectPodcastPerformanceMetricsEntities = createSelector(selectPodcastPerformanceMetricsState, getPodcastPerformanceMetricsEntities);
export const selectSelectedPodcastPerformanceMetrics = createSelector(selectPodcastRoute, selectPodcastPerformanceMetricsEntities,
  (podcastSeriesId: number, entities) => {
    return entities[podcastSeriesId];
  });
