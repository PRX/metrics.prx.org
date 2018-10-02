import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastAllTimeDownloads from '../podcast-alltime-downloads.reducer';
import { selectPodcastRoute } from './router.selectors';
import { PodcastAllTimeDownloads } from '../models';

export const selectPodcastAllTimeDownloadsState = createFeatureSelector<fromPodcastAllTimeDownloads.State>('podcastAllTimeDownloads');

export const selectPodcastAllTimeDownloadsIds = createSelector(
  selectPodcastAllTimeDownloadsState,
  fromPodcastAllTimeDownloads.selectPodcastAllTimeDownloadsIds
);
export const selectPodcastAllTimeDownloadsEntities = createSelector(
  selectPodcastAllTimeDownloadsState,
  fromPodcastAllTimeDownloads.selectPodcastAllTimeDownloadsEntities
);
export const selectAllPodcastAllTimeDownloads = createSelector(
  selectPodcastAllTimeDownloadsState,
  fromPodcastAllTimeDownloads.selectAllPodcastAllTimeDownloads
);

export const selectAllPodcastAllTimeDownloadsLoading = createSelector(selectAllPodcastAllTimeDownloads, (downloads: PodcastAllTimeDownloads[]) => {
  return downloads.some((m: PodcastAllTimeDownloads) => m.loading);
});
export const selectAllPodcastAllTimeDownloadsLoaded = createSelector(selectAllPodcastAllTimeDownloads, (downloads: PodcastAllTimeDownloads[]) => {
  return downloads.every((m: PodcastAllTimeDownloads) => m.loaded || m.loaded === undefined);
});
export const selectAllPodcastAllTimeDownloadsError = createSelector(selectAllPodcastAllTimeDownloads, (downloads: PodcastAllTimeDownloads[]) => {
  return downloads.filter(m => m.error);
});

export const selectRoutedPodcastAllTimeDownloads = createSelector(selectPodcastAllTimeDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId]);
export const selectRoutedPodcastLoading = createSelector(selectPodcastAllTimeDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId].loading);
export const selectRoutedPodcastLoaded = createSelector(selectPodcastAllTimeDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId].loaded);
export const selectRoutedPodcastError = createSelector(selectPodcastAllTimeDownloadsEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId].error);
