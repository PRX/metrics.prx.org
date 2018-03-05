import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { selectPageRoute, selectPodcastRoute } from './router.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { errorType } from './error.type';

export const selectEpisodeMetrics = createSelector(selectAppState, (state: RootState) => state.episodeMetrics);
export const selectEpisodeMetricsLoading = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.some((m: EpisodeMetricsModel) => m.loading);
});
export const selectEpisodeMetricsLoaded = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.every((m: EpisodeMetricsModel) => m.loaded || m.loaded === undefined);
});
export const selectEpisodeMetricsError = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.filter(m => m.error).map(m => {
    return `${errorType(m.error.status)} error occurred while requesting episode metrics for ${m.guid}`;
  });
});
export const selectEpisodePageMetrics = createSelector(selectPodcastRoute, selectPageRoute, selectEpisodeMetrics,
  (seriesId: number, page: number, metrics: EpisodeMetricsModel[]) => {
    return metrics.filter((metric: EpisodeMetricsModel) => metric.seriesId === seriesId && page === metric.page);
});
