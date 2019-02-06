import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PodcastDownloads } from '../models/podcast-downloads.model';
import { selectPodcastRoute } from './router.selectors';
import * as metricsUtil from '../../../shared/util/metrics.util';
import { PodcastDownloadsState, selectAllPodcastDownloads } from '../podcast-downloads.reducer';

export const selectPodcastDownloadsState = createFeatureSelector<PodcastDownloadsState>('PodcastDownloads');

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

export const selectRoutedPodcastDownloadsTotal = createSelector(selectRoutedPodcastDownloads,
  (podcastDownloads: PodcastDownloads) => {
    if (podcastDownloads && podcastDownloads.downloads) {
      return metricsUtil.getTotal(podcastDownloads.downloads);
    }
  });
