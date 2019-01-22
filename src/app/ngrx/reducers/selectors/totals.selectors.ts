import { createSelector } from '@ngrx/store';
import { selectRoutedPodcastTotalsTableMetrics, selectNestedPodcastTotalsTableMetrics } from './podcast-totals.selectors';
import { selectSelectedEpisodesTotalsTableMetrics, selectNestedEpisodesTotalsTableMetrics } from './episode-totals.selectors';
import { selectEpisodeSelectedEpisodeGuids } from './episode-select.selectors';
import { TotalsTableRow } from '../models';

export const selectTableMetrics =
  createSelector(selectEpisodeSelectedEpisodeGuids, selectSelectedEpisodesTotalsTableMetrics, selectRoutedPodcastTotalsTableMetrics,
  (guids: string[], episode: TotalsTableRow[], podcast: TotalsTableRow[]) => {
    return guids && guids.length ? episode : podcast;
  });
