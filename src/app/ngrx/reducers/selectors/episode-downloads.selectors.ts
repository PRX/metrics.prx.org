import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeDownloads from '../episode-downloads.reducer';
import { selectPageRoute, selectPodcastRoute } from './router.selectors';
import { EpisodeDownloads } from '../models';

export const selectEpisodeDownloadsState = createFeatureSelector<fromEpisodeDownloads.State>('episodeDownloads');

export const selectEpisodeDownloadsGuids = createSelector(
  selectEpisodeDownloadsState,
  fromEpisodeDownloads.selectEpisodeDownloadsGuids
);
export const selectEpisodeDownloadsEntities = createSelector(
  selectEpisodeDownloadsState,
  fromEpisodeDownloads.selectEpisodeDownloadsEntities
);
export const selectAllEpisodeDownloads = createSelector(
  selectEpisodeDownloadsState,
  fromEpisodeDownloads.selectAllEpisodeDownloads
);

export const selectEpisodeDownloadsLoading = createSelector(selectAllEpisodeDownloads, (downloads: EpisodeDownloads[]) => {
  return downloads.some((d: EpisodeDownloads) => d.loading);
});
export const selectEpisodeDownloadsLoaded = createSelector(selectAllEpisodeDownloads, (downloads: EpisodeDownloads[]) => {
  return downloads.every((m: EpisodeDownloads) => m.loaded || m.loaded === undefined);
});
export const selectEpisodeDownloadsError = createSelector(selectAllEpisodeDownloads, (downloads: EpisodeDownloads[]) => {
  return downloads.filter(m => m.error);
});
export const selectRoutedEpisodePageDownloads = createSelector(selectPodcastRoute, selectPageRoute, selectAllEpisodeDownloads,
  (podcastId: string, page: number, downloads: EpisodeDownloads[]) => {
    return downloads.filter((d: EpisodeDownloads) => d.podcastId === podcastId && page === d.page);
});
export const selectRoutedEpisodePageDownloadsLoaded = createSelector(selectPodcastRoute, selectPageRoute, selectAllEpisodeDownloads,
  (podcastId: string, page: number, downloads: EpisodeDownloads[]) => {
    return downloads
      .filter((d: EpisodeDownloads) => d.podcastId === podcastId && page === d.page)
      .every((m: EpisodeDownloads) => m.loaded || m.loaded === undefined);
  });
