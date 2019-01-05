import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeSearch from '../episode-search.reducer';
import { EPISODE_SEARCH_PAGE_SIZE, Episode } from '../models';
import { selectPodcastRoute } from './router.selectors';

export const selectEpisodeSearchState = createFeatureSelector<fromEpisodeSearch.State>('episodeSearch');

export const selectEpisodeSearchTotal = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.getTotal
);
export const selectLastEpisodeSearchPage = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.getPage
);
export const selectEpisodeSearchError = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.getError
);

export const selectEpisodeSearchLoading = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.getLoading
);

export const selectEpisodeSearchSelectedEpisodeGuids = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.getSelected
);

export const selectEpisodeSearchGuids = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.selectEpisodeGuids
);
export const selectEpisodeSearchEntities = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.selectEpisodeEntities
);
export const selectAllSearchEpisodes = createSelector(
  selectEpisodeSearchState,
  fromEpisodeSearch.selectAllEpisodes
);

export const selectNumEpisodeSearchPages = createSelector(
  selectEpisodeSearchTotal,
  (total) => {
    if (total % EPISODE_SEARCH_PAGE_SIZE > 0) {
      return Math.floor(total / EPISODE_SEARCH_PAGE_SIZE) + 1;
    } else {
      return Math.floor(total / EPISODE_SEARCH_PAGE_SIZE);
    }
  }
);

export const selectRoutedPodcastSearchEpisodes = createSelector(
  selectPodcastRoute,
  selectAllSearchEpisodes,
  (podcastId, episodes: Episode[]) => episodes.filter(e => e.podcastId === podcastId)
);
