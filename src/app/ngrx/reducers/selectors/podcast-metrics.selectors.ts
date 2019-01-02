import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { RouterParams, getMetricsProperty, METRICSTYPE_DOWNLOADS } from '../models';
import { PodcastMetrics } from "../models/podcast-metrics.model";
import { selectRouter, selectPodcastRoute } from './router.selectors';
import * as metricsUtil from '../../../shared/util/metrics.util';
import { PodcastMetricsState, selectAllPodcastMetrics } from '../podcast-metrics.reducer';

export const selectPodcastMetricsState = createFeatureSelector<PodcastMetricsState>('podcastMetrics');

export const selectPodcastMetricsFilteredAverage = createSelector(selectPodcastMetricsState, selectRouter,
  (metrics: PodcastMetricsState, routerParams: RouterParams) => {
    // TODO: should zero value data points be included in the average? for some of these zeroes, there just is no data
    // for episodes, including the zero data points before the release date brings the average down
    const metricsEntities = selectAllPodcastMetrics(metrics);
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerParams, metricsEntities);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerParams.interval, METRICSTYPE_DOWNLOADS)];
      return metricsUtil.getWeightedAverage(data, routerParams.beginDate, routerParams.endDate, routerParams.interval);
    }
  });

export const selectPodcastMetricsFilteredTotal = createSelector(selectPodcastMetricsState, selectRouter,
  (metrics: PodcastMetricsState, routerParams: RouterParams) => {
    const metricsEntities = selectAllPodcastMetrics(metrics);
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerParams, metricsEntities);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerParams.interval, METRICSTYPE_DOWNLOADS)];
      return metricsUtil.getTotal(data);
    }
  });

export const selectPodcastMetricsLoading = createSelector(selectPodcastMetricsState, (metrics: PodcastMetricsState) => {
  const metricsEntities = selectAllPodcastMetrics(metrics);
  return metricsEntities.some((m: PodcastMetrics) => m.loading);
});

export const selectPodcastMetricsLoaded = createSelector(selectPodcastMetricsState, (metrics: PodcastMetricsState) => {
  const metricsEntities = selectAllPodcastMetrics(metrics);
  return metricsEntities.every((m: PodcastMetrics) => m.loaded || m.loaded === undefined);
});

export const selectPodcastMetricsError = createSelector(selectPodcastMetricsState, (metrics: PodcastMetricsState) => {
  const metricsEntities = selectAllPodcastMetrics(metrics);
  return metricsEntities.filter(m => m.error);
});

export const selectRoutedPodcastMetrics = createSelector(selectPodcastRoute, selectPodcastMetricsState,
  (podcastId: string, metrics: PodcastMetricsState): PodcastMetrics => {
    const metricsEntities = selectAllPodcastMetrics(metrics);
    return metricsEntities.find((metric: PodcastMetrics) => metric.id === podcastId);
});
