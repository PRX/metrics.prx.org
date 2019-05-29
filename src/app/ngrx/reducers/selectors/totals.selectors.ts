import { createSelector } from '@ngrx/store';
import { selectRoutedPodcastTotals, selectNestedPodcastTotals,
  selectRoutedPodcastTotalsTableMetrics, selectNestedPodcastTotalsTableMetrics } from './podcast-totals.selectors';
import { selectSelectedEpisodesTotals, selectNestedEpisodesTotals,
  selectSelectedEpisodesTotalsTableMetrics, selectNestedEpisodesTotalsTableMetrics } from './episode-totals.selectors';
import { selectAggregateSelectedEpisodeGuids } from './episode-select.selectors';
import { TotalsTableRow, EpisodeTotals, PodcastTotals, Rank } from '../models';
import { aggregateTotalsRanks } from '../../../shared/util/chart.util';

export const selectTotalsRanks =
  createSelector(selectAggregateSelectedEpisodeGuids, selectSelectedEpisodesTotals, selectRoutedPodcastTotals,
  (guids: string[], episode: EpisodeTotals[], podcast: PodcastTotals): Rank[] => {
    if (guids && guids.length) {
      return aggregateTotalsRanks(episode);
    } else if (podcast) {
      return podcast.ranks;
    }
  });

export const selectNestedTotalsRanks =
createSelector(selectAggregateSelectedEpisodeGuids, selectNestedEpisodesTotals, selectNestedPodcastTotals,
  (guids: string[], episode: EpisodeTotals[], podcast: PodcastTotals): Rank[] => {
    if (guids && guids.length) {
      return aggregateTotalsRanks(episode);
    } else if (podcast) {
      return podcast.ranks;
    }
  });

export const selectTableMetrics =
  createSelector(selectAggregateSelectedEpisodeGuids, selectSelectedEpisodesTotalsTableMetrics, selectRoutedPodcastTotalsTableMetrics,
  (guids: string[], episode: TotalsTableRow[], podcast: TotalsTableRow[]) => {
    return guids && guids.length ? episode : podcast;
  });

export const selectNestedTableMetrics =
  createSelector(selectAggregateSelectedEpisodeGuids, selectNestedEpisodesTotalsTableMetrics, selectNestedPodcastTotalsTableMetrics,
  (guids: string[], episode: TotalsTableRow[], podcast: TotalsTableRow[]) => {
    return guids && guids.length ? episode : podcast;
  });
