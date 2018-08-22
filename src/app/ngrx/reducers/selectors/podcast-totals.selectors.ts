import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastTotals from '../podcast-totals.reducer';
import { PodcastTotals, TotalsRank, TotalsTableRow } from '../models';
import { selectPodcastRoute, selectGroupRoute } from './router.selectors';
import { getColor } from '../../../shared/util/chart.util';

export const selectPodcastTotalsState = createFeatureSelector<fromPodcastTotals.State>('podcastTotals');

export const selectPodcastTotalsLoaded = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.getLoaded
);
export const selectPodcastTotalsLoading = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.getLoading
);
export const selectPodcastTotalsError = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.getError
);

export const selectPodcastTotalsKeys = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.selectPodcastTotalsKeys
);
export const selectPodcastTotalsEntities = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.selectPodcastTotalsEntities
);
export const selectAllPodcastTotals = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.selectAllPodcastTotals
);

export const selectRoutedPodcastTotals = createSelector(
  selectPodcastRoute,
  selectGroupRoute,
  selectPodcastTotalsEntities,
  (podcastId: string, group: string, podcastTotalsEntities): PodcastTotals => {
    return podcastTotalsEntities[`${podcastId}-${group}`];
  }
);

export const selectRoutedPodcastTotalsTotalDownloads = createSelector(
  selectRoutedPodcastTotals,
  (podcastRanks: PodcastTotals): number => {
    return podcastRanks ? podcastRanks.ranks.reduce((acc, rank) => acc += rank.total, 0) : undefined;
  }
);

export const selectRoutedPodcastTotalsTableMetrics = createSelector(
  selectRoutedPodcastTotals,
  selectRoutedPodcastTotalsTotalDownloads,
  (podcastTotals: PodcastTotals, totalDownloads: number): TotalsTableRow[] => {
    if (podcastTotals && podcastTotals.ranks) {
      return podcastTotals.ranks.map((rank: TotalsRank, i) => {
        // show just one decimal place?
        const percent = Math.round(rank.count * 1000 / totalDownloads) / 10;
        return {
          color: i < 10 ? getColor(i) : undefined,
          label: rank.label,
          value: rank.count,
          percent
        };
      });
    }
  }
);
