import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeSelect from '../episode-select.reducer';
import { EPISODE_SELECT_PAGE_SIZE, Episode } from '../models';
import { selectPodcastRoute } from './router.selectors';

export const selectEpisodeSelectState = createFeatureSelector<fromEpisodeSelect.State>('episodeSelect');

export const selectEpisodeSelectTotal = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getTotal
);
export const selectLatestEpisodeSelectPage = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getPage
);
export const selectEpisodeSelectedEpisodeGuids = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getSelected
);
export const selectEpisodeSelectSearchTerm = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getSearch
);
export const selectEpisodeSelectSearchTotal = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getSearchTotal
);
export const selectEpisodeSelectError = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getError
);

export const selectEpisodeSelectLoading = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getLoading
);

export const selectEpisodeSelectAllEpisodeGuids = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.selectEpisodeGuids
);
export const selectEpisodeSelectEntities = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.selectEpisodeEntities
);
export const selectAllEpisodeSelectEpisodes = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.selectAllEpisodes
);

export const selectNumEpisodeSelectPages = createSelector(
  selectEpisodeSelectTotal,
  (total) => {
    if (total % EPISODE_SELECT_PAGE_SIZE > 0) {
      return Math.floor(total / EPISODE_SELECT_PAGE_SIZE) + 1;
    } else {
      return Math.floor(total / EPISODE_SELECT_PAGE_SIZE);
    }
  }
);

export const selectRoutedPodcastEpisodeSelectEpisodes = createSelector(
  selectPodcastRoute,
  selectAllEpisodeSelectEpisodes,
  (podcastId, episodes: Episode[]) => episodes.filter(e => e.podcastId === podcastId)
);
