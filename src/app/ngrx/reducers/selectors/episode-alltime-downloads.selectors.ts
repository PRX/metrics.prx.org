import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeAllTimeDownloads from '../episode-alltime-downloads.reducer';
import { Episode, EpisodeAllTimeDownloads } from '../models';
import { selectRoutedPageEpisodes } from './episode.selectors';

export const selectEpisodeAllTimeDownloadsState = createFeatureSelector<fromEpisodeAllTimeDownloads.State>('episodeAllTimeDownloads');

export const selectEpisodeAllTimeDownloadsGuids = createSelector(
  selectEpisodeAllTimeDownloadsState,
  fromEpisodeAllTimeDownloads.selectEpisodeAllTimeDownloadsGuids
);
export const selectEpisodeAllTimeDownloadsEntities = createSelector(
  selectEpisodeAllTimeDownloadsState,
  fromEpisodeAllTimeDownloads.selectEpisodeAllTimeDownloadsEntities
);
export const selectAllEpisodeAllTimeDownloads = createSelector(
  selectEpisodeAllTimeDownloadsState,
  fromEpisodeAllTimeDownloads.selectAllEpisodeAllTimeDownloads
);

export const selectAllEpisodeAllTimeDownloadsLoading = createSelector(selectAllEpisodeAllTimeDownloads, (downloads: EpisodeAllTimeDownloads[]) => {
  return downloads.some((m: EpisodeAllTimeDownloads) => m.loading);
});
export const selectAllEpisodeAllTimeDownloadsLoaded = createSelector(selectAllEpisodeAllTimeDownloads, (downloads: EpisodeAllTimeDownloads[]) => {
  return downloads.every((m: EpisodeAllTimeDownloads) => m.loaded || m.loaded === undefined);
});
export const selectAllEpisodeAllTimeDownloadsError = createSelector(selectAllEpisodeAllTimeDownloads, (downloads: EpisodeAllTimeDownloads[]) => {
  return downloads.filter(m => m.error);
});

export const selectRoutedPageEpisodeAllTimeDownloads = createSelector(selectRoutedPageEpisodes, selectEpisodeAllTimeDownloadsEntities,
  (episodes: Episode[], entities): EpisodeAllTimeDownloads[] => {
    return episodes.filter(episode => entities[episode.guid]).map(episode => entities[episode.guid]);
  });
