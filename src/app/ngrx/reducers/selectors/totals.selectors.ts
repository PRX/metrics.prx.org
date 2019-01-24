import { createSelector } from '@ngrx/store';
import { selectRoutedPodcastTotals, selectNestedPodcastTotals,
  selectRoutedPodcastTotalsTableMetrics, selectNestedPodcastTotalsTableMetrics } from './podcast-totals.selectors';
import { selectSelectedEpisodesTotals, selectNestedEpisodesTotals,
  selectSelectedEpisodesTotalsTableMetrics, selectNestedEpisodesTotalsTableMetrics } from './episode-totals.selectors';
import { selectSelectedEpisodeGuids } from './episode-select.selectors';
import { TotalsTableRow, EpisodeTotals, PodcastTotals, Rank } from '../models';
import { aggregateTotalsMap } from '../../../shared/util/chart.util';

export const selectTotalsRanks =
  createSelector(selectSelectedEpisodeGuids, selectSelectedEpisodesTotals, selectRoutedPodcastTotals,
  (guids: string[], episode: EpisodeTotals[], podcast: PodcastTotals): Rank[] => {
    if (guids && guids.length) {
      return aggregateTotalsMap(episode);
    } else if (podcast) {
      return podcast.ranks;
    }
  });

export const selectNestedTotalsRanks =
createSelector(selectSelectedEpisodeGuids, selectNestedEpisodesTotals, selectNestedPodcastTotals,
  (guids: string[], episode: EpisodeTotals[], podcast: PodcastTotals): Rank[] => {
    if (guids && guids.length) {
      return aggregateTotalsMap(episode);
    } else if (podcast) {
      return podcast.ranks;
    }
  });

export const selectTableMetrics =
  createSelector(selectSelectedEpisodeGuids, selectSelectedEpisodesTotalsTableMetrics, selectRoutedPodcastTotalsTableMetrics,
  (guids: string[], episode: TotalsTableRow[], podcast: TotalsTableRow[]) => {
    return guids && guids.length ? episode : podcast;
  });

export const selectNestedTableMetrics =
  createSelector(selectSelectedEpisodeGuids, selectNestedEpisodesTotalsTableMetrics, selectNestedPodcastTotalsTableMetrics,
  (guids: string[], episode: TotalsTableRow[], podcast: TotalsTableRow[]) => {
    return guids && guids.length ? episode : podcast;
  });
