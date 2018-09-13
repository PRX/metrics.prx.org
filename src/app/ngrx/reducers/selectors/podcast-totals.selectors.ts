import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastTotals from '../podcast-totals.reducer';
import { PodcastTotals, Rank, TotalsTableRow, PodcastGroupCharted, GROUPTYPE_GEOSUBDIV } from '../models';
import { selectPodcastRoute, selectGroupRoute, selectFilterRoute } from './router.selectors';
import { getColor } from '../../../shared/util/chart.util';
import { selectRoutedPodcastGroupCharted } from './podcast-group-charted.selectors';

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
  selectFilterRoute,
  selectPodcastTotalsEntities,
  (podcastId: string, group: string, filter: string, podcastTotalsEntities): PodcastTotals => {
    return group === GROUPTYPE_GEOSUBDIV ?
      podcastTotalsEntities[`${podcastId}-${group}-${filter}`] : podcastTotalsEntities[`${podcastId}-${group}`];
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
  selectRoutedPodcastGroupCharted,
  (podcastTotals: PodcastTotals, totalDownloads: number, groupsCharted: PodcastGroupCharted[]): TotalsTableRow[] => {
    if (podcastTotals && podcastTotals.ranks) {
      return podcastTotals.ranks.map((rank: Rank, i) => {
        // show just one decimal place? maybe instead do just 2 significant digits?
        // const percent = Math.round(rank.count * 1000 / totalDownloads) / 10;
        const percent = rank.total * 100 / totalDownloads;
        return {
          color: i < 10 ? getColor(i) : undefined,
          label: rank.label,
          value: rank.total,
          percent,
          charted: groupsCharted.filter(group => group.charted).map(group => group.groupName).indexOf(rank.label) > -1
        };
      });
    }
  }
);
