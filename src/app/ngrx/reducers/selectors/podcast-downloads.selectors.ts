import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { RouterParams, getMetricsProperty, METRICSTYPE_DOWNLOADS } from '../models';
import { PodcastDownloads } from '../models/podcast-downloads.model';
import { selectRouter, selectPodcastRoute } from './router.selectors';
import * as metricsUtil from '../../../shared/util/metrics.util';
import { PodcastDownloadsState, selectAllPodcastDownloads } from '../podcast-downloads.reducer';

export const selectPodcastDownloadsState = createFeatureSelector<PodcastDownloadsState>('PodcastDownloads');

export const selectPodcastDownloadsFilteredAverage = createSelector(selectPodcastDownloadsState, selectRouter,
  (metrics: PodcastDownloadsState, routerParams: RouterParams) => {
    // TODO: should zero value data points be included in the average? for some of these zeroes, there just is no data
    // for episodes, including the zero data points before the release date brings the average down
    const metricsEntities = selectAllPodcastDownloads(metrics);
    const filteredMetrics = metricsUtil.findPodcastDownloads(routerParams, metricsEntities);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerParams.interval, METRICSTYPE_DOWNLOADS)];
      return metricsUtil.getWeightedAverage(data, routerParams.beginDate, routerParams.endDate, routerParams.interval);
    }
  });

export const selectPodcastDownloadsFilteredTotal = createSelector(selectPodcastDownloadsState, selectRouter,
  (metrics: PodcastDownloadsState, routerParams: RouterParams) => {
    const metricsEntities = selectAllPodcastDownloads(metrics);
    const filteredMetrics = metricsUtil.findPodcastDownloads(routerParams, metricsEntities);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerParams.interval, METRICSTYPE_DOWNLOADS)];
      return metricsUtil.getTotal(data);
    }
  });

export const selectPodcastDownloadsLoading = createSelector(selectPodcastDownloadsState, (metrics: PodcastDownloadsState) => {
  const metricsEntities = selectAllPodcastDownloads(metrics);
  return metricsEntities.some((m: PodcastDownloads) => m.loading);
});

export const selectPodcastDownloadsLoaded = createSelector(selectPodcastDownloadsState, (metrics: PodcastDownloadsState) => {
  const metricsEntities = selectAllPodcastDownloads(metrics);
  return metricsEntities.every((m: PodcastDownloads) => m.loaded || m.loaded === undefined);
});

export const selectPodcastDownloadsError = createSelector(selectPodcastDownloadsState, (metrics: PodcastDownloadsState) => {
  const metricsEntities = selectAllPodcastDownloads(metrics);
  return metricsEntities.filter(m => m.error);
});

export const selectRoutedPodcastDownloads = createSelector(selectPodcastRoute, selectPodcastDownloadsState,
  (podcastId: string, metrics: PodcastDownloadsState): PodcastDownloads => {
    const metricsEntities = selectAllPodcastDownloads(metrics);
    return metricsEntities.find((metric: PodcastDownloads) => metric.id === podcastId);
});
