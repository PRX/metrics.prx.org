import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { RouterParams, getMetricsProperty, METRICSTYPE_DOWNLOADS } from '../models';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { selectRouter, selectPodcastRoute } from './router.selectors';
import * as metricsUtil from '../../../shared/util/metrics.util';

export const selectPodcastMetrics = createSelector(selectAppState, (state: RootState) => state.podcastMetrics);
export const selectPodcastMetricsFilteredAverage = createSelector(selectPodcastMetrics, selectRouter,
  (metrics: PodcastMetricsModel[], routerParams: RouterParams) => {
    // TODO: should zero value data points be included in the average? for some of these zeroes, there just is no data
    // for episodes, including the zero data points before the release date brings the average down
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerParams, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerParams.interval, METRICSTYPE_DOWNLOADS)];
      return metricsUtil.getWeightedAverage(data, routerParams.beginDate, routerParams.endDate, routerParams.interval);
    }
  });
export const selectPodcastMetricsFilteredTotal = createSelector(selectPodcastMetrics, selectRouter,
  (metrics: PodcastMetricsModel[], routerParams: RouterParams) => {
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerParams, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerParams.interval, METRICSTYPE_DOWNLOADS)];
      return metricsUtil.getTotal(data);
    }
  });
export const selectPodcastMetricsLoading = createSelector(selectPodcastMetrics, (metrics: PodcastMetricsModel[]) => {
  return metrics.some((m: PodcastMetricsModel) => m.loading);
});
export const selectPodcastMetricsLoaded = createSelector(selectPodcastMetrics, (metrics: PodcastMetricsModel[]) => {
  return metrics.every((m: PodcastMetricsModel) => m.loaded || m.loaded === undefined);
});

export const selectPodcastMetricsError = createSelector(selectPodcastMetrics, (metrics: PodcastMetricsModel[]) => {
  return metrics.filter(m => m.error);
});
export const selectRoutedPodcastMetrics = createSelector(selectPodcastRoute, selectPodcastMetrics,
  (podcastId: string, metrics: PodcastMetricsModel[]): PodcastMetricsModel => {
    return metrics.find((metric: PodcastMetricsModel) => metric.id === podcastId);
});
