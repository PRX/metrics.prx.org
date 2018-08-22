import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { selectPageRoute, selectPodcastRoute } from './router.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';

export const selectEpisodeMetrics = createSelector(selectAppState, (state: RootState) => state.episodeMetrics);
export const selectEpisodeMetricsLoading = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.some((m: EpisodeMetricsModel) => m.loading);
});
export const selectEpisodeMetricsLoaded = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.every((m: EpisodeMetricsModel) => m.loaded || m.loaded === undefined);
});
export const selectEpisodeMetricsError = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.filter(m => m.error);
});
export const selectRoutedEpisodePageMetrics = createSelector(selectPodcastRoute, selectPageRoute, selectEpisodeMetrics,
  (podcastId: string, page: number, metrics: EpisodeMetricsModel[]) => {
    return metrics.filter((metric: EpisodeMetricsModel) => metric.podcastId === podcastId && page === metric.page);
});
export const selectRoutedEpisodePageMetricsLoaded = createSelector(selectPodcastRoute, selectPageRoute, selectEpisodeMetrics,
  (podcastId: string, page: number, metrics: EpisodeMetricsModel[]) => {
    return metrics
      .filter((metric: EpisodeMetricsModel) => metric.podcastId === podcastId && page === metric.page)
      .every((m: EpisodeMetricsModel) => m.loaded || m.loaded === undefined);
  });
