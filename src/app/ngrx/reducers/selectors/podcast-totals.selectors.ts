import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastTotals from '../podcast-totals.reducer';
import { PodcastTotals, Rank, podcastTotalsId,
  TotalsTableRow, GroupCharted,
  GroupType, GROUPTYPE_GEOSUBDIV } from '../models';
import { selectPodcastRoute, selectGroupRoute,
  selectFilterRoute, selectBeginDateRoute, selectEndDateRoute } from './router.selectors';
import { getColor, isGroupCharted } from '../../../shared/util/chart.util';
import { selectRoutedGroupCharted } from './group-charted.selectors';

export const selectPodcastTotalsState = createFeatureSelector<fromPodcastTotals.State>('podcastTotals');

export const selectPodcastTotalsIds = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.selectPodcastTotalsIds
);
export const selectPodcastTotalsEntities = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.selectPodcastTotalsEntities
);
export const selectAllPodcastTotals = createSelector(
  selectPodcastTotalsState,
  fromPodcastTotals.selectAllPodcastTotals
);

export const selectAllPodcastTotalsErrors = createSelector(
  selectAllPodcastTotals,
  (totals: PodcastTotals[]) => {
    return totals.filter(t => t.error);
  });

export const selectAllPodcastTotalsLoading = createSelector(selectAllPodcastTotals, (totals: PodcastTotals[]) => {
  return totals.some((t: PodcastTotals) => t.loading);
});
export const selectAllPodcastTotalsLoaded = createSelector(selectAllPodcastTotals, (totals: PodcastTotals[]) => {
  return totals.every((t: PodcastTotals) => t.loaded);
});

export const selectRoutedPodcastTotals = createSelector(
  selectPodcastRoute,
  selectGroupRoute,
  selectFilterRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectPodcastTotalsEntities,
  (podcastId: string, group: GroupType, filter: string, beginDate: Date, endDate: Date, podcastTotalsEntities): PodcastTotals => {
    return podcastTotalsEntities[podcastTotalsId(podcastId, group, filter, beginDate, endDate)];
  }
);

export const selectRoutedPodcastTotalsLoading = createSelector(
  selectRoutedPodcastTotals,
  (totals: PodcastTotals) => !totals || totals.loading
);

export const selectRoutedPodcastTotalsLoaded = createSelector(
  selectRoutedPodcastTotals,
  (totals: PodcastTotals) => totals && totals.loaded
);

export const selectRoutedPodcastTotalsError = createSelector(
  selectRoutedPodcastTotals,
  (totals: PodcastTotals) => totals && totals.error
);

export const selectNestedPodcastTotals = createSelector(
  selectPodcastRoute,
  selectFilterRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectPodcastTotalsEntities,
  (podcastId: string, filter: string, beginDate: Date, endDate: Date, podcastTotalsEntities): PodcastTotals => {
    return podcastTotalsEntities[podcastTotalsId(podcastId, GROUPTYPE_GEOSUBDIV, filter, beginDate, endDate)];
  }
);

export const selectNestedPodcastTotalsLoading = createSelector(
  selectNestedPodcastTotals,
  (totals: PodcastTotals) => !totals || totals.loading
);

export const selectNestedPodcastTotalsLoaded = createSelector(
  selectNestedPodcastTotals,
  (totals: PodcastTotals) => totals && totals.loaded
);

export const selectNestedPodcastTotalsError = createSelector(
  selectNestedPodcastTotals,
  (totals: PodcastTotals) => totals && totals.error
);

export const selectRoutedPodcastTotalsTotalDownloads = createSelector(
  selectRoutedPodcastTotals,
  (podcastRanks: PodcastTotals): number => {
    return podcastRanks && podcastRanks.ranks ? podcastRanks.ranks.reduce((acc, rank) => acc += rank.total, 0) : undefined;
  }
);

export const selectRoutedPodcastTotalsTableMetrics = createSelector(
  selectRoutedPodcastTotals,
  selectRoutedPodcastTotalsTotalDownloads,
  selectRoutedGroupCharted,
  (podcastTotals: PodcastTotals, totalDownloads: number, groupsCharted: GroupCharted[]): TotalsTableRow[] => {
    if (podcastTotals && podcastTotals.ranks) {
      return podcastTotals.ranks.map((rank: Rank, i) => {
        // show just one decimal place? maybe instead do just 2 significant digits?
        // const percent = Math.round(rank.count * 1000 / totalDownloads) / 10;
        const percent = rank.total * 100 / totalDownloads;
        return {
          color: i < 10 ? getColor(i) : undefined,
          code: rank.code,
          label: rank.label,
          value: rank.total,
          percent,
          charted: isGroupCharted(groupsCharted, rank.label)
        };
      });
    }
  }
);

export const selectNestedPodcastTotalsTableMetrics = createSelector(
  selectNestedPodcastTotals,
  (podcastTotals: PodcastTotals): TotalsTableRow[] => {
    if (podcastTotals && podcastTotals.ranks) {
      return podcastTotals.ranks.map((rank: Rank, i) => {
        // show just one decimal place? maybe instead do just 2 significant digits?
        // const percent = Math.round(rank.count * 1000 / totalDownloads) / 10;
        return {
          color: i < 10 ? getColor(i) : undefined,
          code: rank.code,
          label: rank.label,
          value: rank.total
        };
      });
    }
  }
);

