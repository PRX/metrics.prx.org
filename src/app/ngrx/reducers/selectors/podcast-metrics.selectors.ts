import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { RouterModel, getMetricsProperty } from '../models';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { selectRouter } from './router.selectors';
import { errorType } from './error.type';
import * as metricsUtil from '../../../shared/util/metrics.util';

export const selectPodcastMetrics = createSelector(selectAppState, (state: RootState) => state.podcastMetrics);
export const selectPodcastMetricsFilteredAverage = createSelector(selectPodcastMetrics, selectRouter,
  (metrics: PodcastMetricsModel[], routerState: RouterModel) => {
    // TODO: should zero value data points be included in the average? for some of these zeroes, there just is no data
    // for episodes, including the zero data points before the release date brings the average down
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerState, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerState.interval, 'downloads')];
      return metricsUtil.getWeightedAverage(data, routerState.beginDate, routerState.endDate, routerState.interval);
    }
  });
export const selectPodcastMetricsFilteredTotal = createSelector(selectPodcastMetrics, selectRouter,
  (metrics: PodcastMetricsModel[], routerState: RouterModel) => {
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerState, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerState.interval, 'downloads')];
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
  return metrics.filter(m => m.error).map(m => {
    return `${errorType(m.error.status)} error occurred while requesting podcast metrics`;
  });
});
