import { createSelector } from '@ngrx/store';
import {
  selectRoutedPodcastTotalsLoading, selectRoutedPodcastTotalsLoaded, selectRoutedPodcastTotalsError,
  selectRoutedPodcastTotalsTotalDownloads, selectRoutedPodcastTotalsTableMetrics,
  selectNestedPodcastTotalsLoading, selectNestedPodcastTotalsLoaded, selectNestedPodcastTotalsError,
  selectNestedPodcastTotalsTableMetrics } from './podcast-totals.selectors';
import {
  selectSelectedEpisodesTotalsLoading, selectSelectedEpisodesTotalsLoaded, selectSelectedEpisodesTotalsError,
  selectSelectedEpisodesTotalsTotalDownloads, selectSelectedEpisodesTotalsTableMetrics,
  selectNestedEpisodesTotalsLoading, selectNestedEpisodesTotalsLoaded, selectNestedEpisodesTotalsError,
  selectNestedEpisodesTotalsTableMetrics } from './episode-totals.selectors';
import { selectEpisodeSelectedEpisodeGuids } from './episode-select.selectors';
import { TotalsTableRow } from '../models';

export const selectTableMetrics =
  createSelector(selectEpisodeSelectedEpisodeGuids, selectSelectedEpisodesTotalsTableMetrics, selectRoutedPodcastTotalsTableMetrics,
  (guids: string[], episode: TotalsTableRow[], podcast: TotalsTableRow[]) => {
    return guids && guids.length ? episode : podcast;
  });
