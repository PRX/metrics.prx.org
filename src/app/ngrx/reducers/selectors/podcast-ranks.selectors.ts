import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastRanks from '../podcast-ranks.reducer';
import { PodcastRanks, RanksRank, IntervalModel } from '../models';
import { selectPodcastRoute, selectGroupRoute, selectIntervalRoute } from './router.selectors';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { getColor, neutralColor, mapMetricsToTimeseriesData } from '../../../shared/util/chart.util';

export const selectPodcastRanksState = createFeatureSelector<fromPodcastRanks.State>('podcastRanks');

export const selectPodcastRanksLoaded = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.getLoaded
);
export const selectPodcastRanksLoading = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.getLoading
);
export const selectPodcastRanksError = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.getError
);

export const selectPodcastRanksKeys = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.selectPodcastRanksKeys
);
export const selectPodcastRanksEntities = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.selectPodcastRanksEntities
);
export const selectAllPodcastRanks = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.selectAllPodcastRanks
);

export const selectRoutedPodcastRanks = createSelector(
  selectPodcastRoute,
  selectGroupRoute,
  selectIntervalRoute,
  selectPodcastRanksEntities,
  (podcastId: string, group: string, interval: IntervalModel, podcastRanksEntities): PodcastRanks => {
    return podcastRanksEntities[`${podcastId}-${group}-${interval && interval.key}`];
  }
);

export const selectRoutedPodcastRanksChartMetrics = createSelector(
  selectRoutedPodcastRanks,
  (podcastRanks: PodcastRanks): TimeseriesChartModel[] => {
    if (podcastRanks && podcastRanks.ranks && podcastRanks.downloads) {
      return podcastRanks.ranks.map((rank: RanksRank, i: number) => {
        const downloads = podcastRanks.downloads.map(data => [data[0], data[1][i]]);
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
  selectRoutedPodcastRanks,
  (podcastRanks: PodcastRanks): number => {
    return podcastRanks ? podcastRanks.ranks.reduce((acc, rank) => acc += rank.total, 0) : undefined;
  }
);
