import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeDownloads from '../episode-downloads.reducer';
import { EpisodeDownloads } from '../models';
import { selectRoutedPageEpisodes } from "./episode.selectors";
import { Episode } from '../models/episode.model';

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

export const selectAllEpisodeDownloadsLoading = createSelector(selectAllEpisodeDownloads, (downloads: EpisodeDownloads[]) => {
  return downloads.some((m: EpisodeDownloads) => m.loading);
});
export const selectAllEpisodeDownloadsLoaded = createSelector(selectAllEpisodeDownloads, (downloads: EpisodeDownloads[]) => {
  return downloads.every((m: EpisodeDownloads) => m.loaded || m.loaded === undefined);
});
export const selectAllEpisodeDownloadsError = createSelector(selectAllEpisodeDownloads, (downloads: EpisodeDownloads[]) => {
  return downloads.filter(m => m.error);
});

export const selectRoutedPageEpisodeDownloads = createSelector(selectRoutedPageEpisodes, selectEpisodeDownloadsEntities,
  (episodes: Episode[], entities): EpisodeDownloads[] => {
    return episodes.filter(episode => entities[episode.guid]).map(episode => entities[episode.guid]);
  });
