import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisode from '../castle-episode.reducer';
import { Episode, EPISODE_PAGE_SIZE } from '../models';
import { selectPageRoute, selectPodcastRoute } from './router.selectors';

export const selectEpisodeState = createFeatureSelector<fromEpisode.State>('episode');

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
