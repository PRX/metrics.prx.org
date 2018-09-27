import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastTotals from '../podcast-totals.reducer';
import { PodcastTotals, Rank, podcastTotalsKey,
  TotalsTableRow, PodcastGroupCharted,
  MetricsType, GroupType, GROUPTYPE_GEOSUBDIV, getGroupName } from '../models';
import { selectPodcastRoute, selectMetricsTypeRoute, selectGroupRoute,
  selectFilterRoute, selectBeginDateRoute, selectEndDateRoute } from './router.selectors';
import { getColor } from '../../../shared/util/chart.util';
import { selectRoutedPodcastGroupCharted } from './podcast-group-charted.selectors';

export const selectPodcastTotalsState = createFeatureSelector<fromPodcastTotals.State>('podcastTotals');

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
    return podcastTotalsEntities[podcastTotalsKey(podcastId, group, filter, beginDate, endDate)];
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
    return podcastTotalsEntities[podcastTotalsKey(podcastId, GROUPTYPE_GEOSUBDIV, filter, beginDate, endDate)];
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
  selectRoutedPodcastGroupCharted,
  (podcastTotals: PodcastTotals, totalDownloads: number, groupsCharted: PodcastGroupCharted[]): TotalsTableRow[] => {
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
          charted: groupsCharted.filter(group => group.charted).map(group => group.groupName).indexOf(rank.label) > -1
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

export const selectRoutedPodcastTotalsGeochartMetrics = createSelector(
  selectRoutedPodcastTotals,
  selectMetricsTypeRoute,
  selectGroupRoute,
  (podcastTotals: PodcastTotals, metricsType: MetricsType, group: GroupType): any[][] => {
    if (podcastTotals && podcastTotals.ranks) {
      // @ts-ignore TypeScript does not like mixed type arrays
      return [[getGroupName(metricsType, group), 'Downloads']].concat(podcastTotals.ranks.map((rank: Rank, i) => {
        return [rank.label, rank.total];
      }));
    }
  }
);

export const selectNestedPodcastTotalsGeochartMetrics = createSelector(
  selectNestedPodcastTotals,
  (podcastTotals: PodcastTotals): any[][] => {
    if (podcastTotals && podcastTotals.ranks) {
      // @ts-ignore TypeScript does not like mixed type arrays
      return [['Region', 'Downloads']].concat(podcastTotals.ranks.map((rank: Rank, i) => {
        return [rank.label, rank.total];
      }));
    }
  }
);
