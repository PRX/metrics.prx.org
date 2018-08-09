import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisode from '../episode.reducer';
import { Episode, EPISODE_PAGE_SIZE } from '../models';
import { selectPageRoute, selectPodcastRoute } from './router.selectors';

export const selectEpisodeState = createFeatureSelector<fromEpisode.State>('episode');

export const selectEpisodePagesLoaded = createSelector(
  selectEpisodeState,
  fromEpisode.getPagesLoaded
);
export const selectEpisodePagesLoading = createSelector(
  selectEpisodeState,
  fromEpisode.getPagesLoading
);
export const selectEpisodeError = createSelector(
  selectEpisodeState,
  fromEpisode.getError
);

export const selectEpisodeGuids = createSelector(
  selectEpisodeState,
  fromEpisode.selectEpisodeGuids
);
export const selectEpisodeEntities = createSelector(
  selectEpisodeState,
  fromEpisode.selectEpisodeEntities
);
export const selectAllEpisodes = createSelector(
  selectEpisodeState,
  fromEpisode.selectAllEpisodes
);

export const selectNumEpisodePages = createSelector(
  selectPodcastRoute,
  selectAllEpisodes,
  (podcastId: string, allEpisodes: Episode[]) => {
    const episodes = allEpisodes.filter(episode => episode.podcastId === podcastId);
    if (episodes.length % EPISODE_PAGE_SIZE > 0) {
      return Math.floor(episodes.length / EPISODE_PAGE_SIZE) + 1;
    } else {
      return Math.floor(episodes.length / EPISODE_PAGE_SIZE);
    }
  }
);

export const selectRoutedPageEpisodes = createSelector(selectAllEpisodes, selectPageRoute, (episodes: Episode[], page: number) => {
  return episodes.filter(episode => episode.page === page);
});

export const selectRoutedPageLoaded = createSelector(selectEpisodePagesLoaded, selectPageRoute, (loaded: number[], page: number) => {
  return loaded.indexOf(page) !== -1;
});
export const selectRoutedPageLoading = createSelector(selectEpisodePagesLoading, selectPageRoute, (loading: number[], page: number) => {
  return loading.indexOf(page) !== -1;
});
