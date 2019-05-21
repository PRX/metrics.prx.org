import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeSelect from '../episode-select.reducer';
import { EPISODE_SELECT_PAGE_SIZE, Episode,
  MetricsType, METRICSTYPE_DOWNLOADS, METRICSTYPE_DROPDAY, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES } from '../models';
import { selectPodcastRoute, selectMetricsTypeRoute } from './router.selectors';

export const selectEpisodeSelectState = createFeatureSelector<fromEpisodeSelect.State>('episodeSelect');

export const selectEpisodeSelectTotal = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getTotal
);
export const selectLatestEpisodeSelectPage = createSelector(
  selectEpisodeSelectState,
  fromEpisodeSelect.getPage
);
export const selectSelectedEpisodeGuids = createSelector(
  selectEpisodeSelectState,
  selectPodcastRoute,
  selectMetricsTypeRoute,
  (state: fromEpisodeSelect.State, podcastId: string, metricsType: MetricsType) => {
    switch (metricsType) {
      case METRICSTYPE_DOWNLOADS:
        return state.downloadsSelected[podcastId];
      case METRICSTYPE_DROPDAY:
        return state.dropdaySelected[podcastId];
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        return state.aggregateSelected[podcastId];
    }
  }
);
export const selectDownloadsSelectedEpisodeGuids = createSelector(
  selectEpisodeSelectState,
  selectPodcastRoute,
  (state: fromEpisodeSelect.State, podcastId: string) => state.downloadsSelected[podcastId]
);
export const selectDropdaySelectedEpisodeGuids = createSelector(
  selectEpisodeSelectState,
  selectPodcastRoute,
  (state: fromEpisodeSelect.State, podcastId: string) => state.dropdaySelected[podcastId]
);
export const selectAggregateSelectedEpisodeGuids = createSelector(
  selectEpisodeSelectState,
  selectPodcastRoute,
  (state: fromEpisodeSelect.State, podcastId: string) => state.aggregateSelected[podcastId]
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

export const selectRoutedPodcastEpisodesSelectList = createSelector(
  selectPodcastRoute,
  selectAllEpisodeSelectEpisodes,
  (podcastId, episodes: Episode[]) =>
    episodes.filter(e => e.podcastId === podcastId).sort((a, b) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
);

export const selectRoutedPodcastSelectedEpisodes = createSelector(
  selectRoutedPodcastEpisodesSelectList,
  selectSelectedEpisodeGuids,
  (episodes: Episode[], selectedEpisodeGuids) => {
    return episodes && episodes.filter(e => selectedEpisodeGuids && selectedEpisodeGuids.indexOf(e.guid) > -1);
  }
);
