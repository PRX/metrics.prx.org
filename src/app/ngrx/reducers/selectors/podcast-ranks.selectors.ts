import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastRanks from '../podcast-ranks.reducer';
import {
  PodcastRanks,
  Rank,
  podcastRanksId,
  GroupType,
  IntervalModel,
  GroupCharted,
  ChartType,
  CHARTTYPE_HORIZBAR,
  GROUPTYPE_GEOSUBDIV,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_GEOMETRO
} from '../models';
import { selectPodcastRoute,
  selectChartTypeRoute,
  selectGroupRoute,
  selectFilterRoute,
  selectIntervalRoute,
  selectBeginDateRoute,
  selectEndDateRoute } from './router.selectors';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import { getColor, neutralColor, mapMetricsToTimeseriesData, isGroupCharted } from '../../../shared/util/chart.util';
import { selectRoutedGroupCharted } from './group-charted.selectors';

export const selectPodcastRanksState = createFeatureSelector<fromPodcastRanks.State>('podcastRanks');

export const selectPodcastRanksIds = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.selectPodcastRanksIds
);
export const selectPodcastRanksEntities = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.selectPodcastRanksEntities
);
export const selectAllPodcastRanks = createSelector(
  selectPodcastRanksState,
  fromPodcastRanks.selectAllPodcastRanks
);

export const selectAllPodcastRanksLoading = createSelector(selectAllPodcastRanks, (ranks: PodcastRanks[]) => {
  return ranks.some((r: PodcastRanks) => r.loading);
});
export const selectAllPodcastRanksLoaded = createSelector(selectAllPodcastRanks, (ranks: PodcastRanks[]) => {
  return ranks.every((r: PodcastRanks) => r.loaded);
});
export const selectAllPodcastRanksErrors = createSelector(selectAllPodcastRanks, (ranks: PodcastRanks[]) => {
  return ranks.filter((r: PodcastRanks) => r.error);
});

export const selectRoutedPodcastRanks = createSelector(
  selectPodcastRoute,
  selectGroupRoute,
  selectFilterRoute,
  selectIntervalRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectPodcastRanksEntities,
  (podcastId: string,
   group: GroupType,
   filter: string,
   interval: IntervalModel,
   beginDate: Date,
   endDate: Date,
   podcastRanksEntities): PodcastRanks => {
    return podcastRanksEntities[podcastRanksId(podcastId, group, filter, interval, beginDate, endDate)];
  }
);

export const selectRoutedPodcastRanksLoading = createSelector(
  selectRoutedPodcastRanks,
  (ranks: PodcastRanks) => !ranks || ranks.loading
);

export const selectRoutedPodcastRanksLoaded = createSelector(
  selectRoutedPodcastRanks,
  (ranks: PodcastRanks) => ranks && ranks.loaded
);

export const selectRoutedPodcastRanksError = createSelector(
  selectRoutedPodcastRanks,
  (ranks: PodcastRanks) => ranks && ranks.error
);

export const selectNestedPodcastRanks = createSelector(
  selectPodcastRoute,
  selectFilterRoute,
  selectIntervalRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectPodcastRanksEntities,
  (podcastId: string,
   filter: string,
   interval: IntervalModel,
   beginDate: Date,
   endDate: Date,
   podcastRanksEntities): PodcastRanks => {
    return podcastRanksEntities[podcastRanksId(podcastId, GROUPTYPE_GEOSUBDIV, filter, interval, beginDate, endDate)];
  }
);

export const selectNestedPodcastRanksLoading = createSelector(
  selectNestedPodcastRanks,
  (ranks: PodcastRanks) => !ranks || ranks.loading
);

export const selectNestedPodcastRanksLoaded = createSelector(
  selectNestedPodcastRanks,
  (ranks: PodcastRanks) => ranks && ranks.loaded
);

export const selectNestedPodcastRanksError = createSelector(
  selectNestedPodcastRanks,
  (ranks: PodcastRanks) => ranks && ranks.error
);

export const selectRoutedPodcastRanksChartMetrics = createSelector(
  selectRoutedPodcastRanks,
  selectRoutedGroupCharted,
  selectGroupRoute,
  selectChartTypeRoute,
  (podcastRanks: PodcastRanks,
   groupsCharted: GroupCharted[],
   groupRoute: GroupType,
   chartType: ChartType): CategoryChartModel[] | TimeseriesChartModel[] => {
    if (podcastRanks && podcastRanks.ranks && podcastRanks.downloads) {
      if (chartType === CHARTTYPE_HORIZBAR) {
        return podcastRanks.ranks.map(rank => {
          return {
            value: rank.total,
            label: rank.label
          };
        }).filter((entry: CategoryChartModel) => {
          return (entry.label !== 'Other' || entry.value !== 0) && isGroupCharted(groupsCharted, entry.label);
        });
      } else {
        return podcastRanks.ranks
          .filter((rank: Rank) => rank.label !== 'Other' || rank.total !== 0)
          .map((rank: Rank, i: number) => {
            const downloads = podcastRanks.downloads.map(data => [data[0], data[1][i]]);
            return {
              data: mapMetricsToTimeseriesData(downloads),
              label: rank.label,
              color: rank.label === 'Other' ? neutralColor : getColor(i)
            };
          })
          .filter((entry: TimeseriesChartModel) => {
            return isGroupCharted(groupsCharted, entry.label) &&
              !((groupRoute === GROUPTYPE_GEOCOUNTRY || groupRoute === GROUPTYPE_GEOMETRO) && entry.label === 'Other');
          });
      }
    }
  }
);

export const selectNestedPodcastRanksChartMetrics = createSelector(
  selectNestedPodcastRanks,
  (podcastRanks: PodcastRanks): TimeseriesChartModel[] => {
    return podcastRanks && podcastRanks.ranks && podcastRanks.ranks
      .map((rank: Rank, i: number) => {
        const downloads = podcastRanks.downloads
          .map(data => [data[0], data[1][i]]);
        return {
          data: mapMetricsToTimeseriesData(downloads),
          label: rank.label,
          color: rank.label === 'Other' ? neutralColor : getColor(i)
        };
      })
      .filter((entry: TimeseriesChartModel) => entry.label !== 'Other');
  }
);

export const selectRoutedPodcastRanksTotalDownloads = createSelector(
  selectRoutedPodcastRanks,
  (podcastRanks: PodcastRanks): number => {
    return podcastRanks && podcastRanks.ranks ? podcastRanks.ranks.reduce((acc, rank) => acc += rank.total, 0) : undefined;
  }
);
