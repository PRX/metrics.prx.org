import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastDownloads from '../podcast-downloads.reducer';
import { selectPodcastRoute } from './router.selectors';
import { PodcastDownloads } from '../models';

export const selectPodcastDownloadsState = createFeatureSelector<fromPodcastDownloads.State>('podcastDownloads');

export const selectPodcastDownloadsIds = createSelector(
  selectPodcastDownloadsState,
  fromPodcastDownloads.selectPodcastDownloadsIds
);
export const selectPodcastDownloadsEntities = createSelector(
  selectPodcastDownloadsState,
  fromPodcastDownloads.selectPodcastDownloadsEntities
);
export const selectAllPodcastDownloads = createSelector(
  selectPodcastDownloadsState,
  fromPodcastDownloads.selectAllPodcastDownloads
);

export const selectAllPodcastDownloadsLoading = createSelector(selectAllPodcastDownloads, (downloads: PodcastDownloads[]) => {
  return downloads.some((m: PodcastDownloads) => m.loading);
});
export const selectAllPodcastDownloadsLoaded = createSelector(selectAllPodcastDownloads, (downloads: PodcastDownloads[]) => {
  return downloads.every((m: PodcastDownloads) => m.loaded || m.loaded === undefined);
});
export const selectAllPodcastDownloadsError = createSelector(selectAllPodcastDownloads, (downloads: PodcastDownloads[]) => {
  return downloads.filter(m => m.error);
});

export const selectRoutedPodcastDownloads = createSelector(selectPodcastDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId]);
export const selectRoutedPodcastLoading = createSelector(selectPodcastDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId].loading);
export const selectRoutedPodcastLoaded = createSelector(selectPodcastDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId].loaded);
export const selectRoutedPodcastError = createSelector(selectPodcastDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId].error);
