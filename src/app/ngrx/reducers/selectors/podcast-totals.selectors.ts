import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastTotals from '../podcast-totals.reducer';
import { PodcastTotals, Totals, IntervalModel } from '../models';
import { selectPodcastRoute, selectGroupRoute, selectIntervalRoute } from './router.selectors';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { getColor, neutralColor, mapMetricsToTimeseriesData } from '../../../shared/util/chart.util';

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
  selectIntervalRoute,
  selectPodcastTotalsEntities,
  (podcastId: string, group: string, interval: IntervalModel, podcastTotalsEntities): PodcastTotals => {
    return podcastTotalsEntities[`${podcastId}-${group}-${interval && interval.key}`];
  }
);

export const selectRoutedPodcastTotalsChartMetrics = createSelector(
  selectRoutedPodcastTotals,
  (podcastTotals: PodcastTotals): TimeseriesChartModel[] => {
    if (podcastTotals && podcastTotals.downloads) {
      return podcastTotals.ranks.map((rank: Totals, i: number) => {
        const downloads = podcastTotals.downloads.map(data => [data[0], data[1][i]]);
        return {
          data: mapMetricsToTimeseriesData(downloads),
          label: rank.label,
          color: rank.label === 'Other' ? neutralColor : getColor(i)
        };
      });
    }
  }
);

export const selectRoutedPodcastRanksTotalDownloads = createSelector(
  selectRoutedPodcastTotals,
  (podcastRanks: PodcastTotals): number => {
    return podcastRanks ? podcastRanks.ranks.reduce((acc, rank) => acc += rank.total, 0) : undefined;
  }
);
