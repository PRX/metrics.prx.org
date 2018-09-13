import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastRanks from '../podcast-ranks.reducer';
import {
  PodcastRanks,
  Rank,
  IntervalModel,
  PodcastGroupCharted,
  ChartType,
  CHARTTYPE_HORIZBAR,
  GROUPTYPE_GEOSUBDIV
} from '../models';
import { selectPodcastRoute, selectChartTypeRoute, selectGroupRoute, selectFilterRoute, selectIntervalRoute } from './router.selectors';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import { getColor, neutralColor, mapMetricsToTimeseriesData } from '../../../shared/util/chart.util';
import { selectRoutedPodcastGroupCharted } from './podcast-group-charted.selectors';

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
  selectFilterRoute,
  selectIntervalRoute,
  selectPodcastRanksEntities,
  (podcastId: string, group: string, filter: string, interval: IntervalModel, podcastRanksEntities): PodcastRanks => {
    return group === GROUPTYPE_GEOSUBDIV ?
      podcastRanksEntities[`${podcastId}-${group}-${filter}-${interval && interval.key}`] :
      podcastRanksEntities[`${podcastId}-${group}-${interval && interval.key}`];
  }
);

export const selectRoutedPodcastRanksChartMetrics = createSelector(
  selectRoutedPodcastRanks,
  selectRoutedPodcastGroupCharted,
  selectChartTypeRoute,
  (podcastRanks: PodcastRanks,
   groupsCharted: PodcastGroupCharted[],
   chartType: ChartType): CategoryChartModel[] | TimeseriesChartModel[] => {
    if (podcastRanks && podcastRanks.ranks && podcastRanks.downloads) {
      if (chartType === CHARTTYPE_HORIZBAR) {
        return podcastRanks.ranks.map(rank => {
          return {
            value: rank.total,
            label: rank.label
          };
        }).filter((entry: CategoryChartModel) => {
          return groupsCharted.filter(group => group.charted).map(group => group.groupName).indexOf(entry.label) > -1;
        });
      } else {
        return podcastRanks.ranks
          .map((rank: Rank, i: number) => {
            const downloads = podcastRanks.downloads.map(data => [data[0], data[1][i]]);
            return {
              data: mapMetricsToTimeseriesData(downloads),
              label: rank.label,
              color: rank.label === 'Other' ? neutralColor : getColor(i)
            };
          })
          .filter((entry: TimeseriesChartModel) => {
            return groupsCharted.filter(group => group.charted).map(group => group.groupName).indexOf(entry.label) > -1;
          });
      }
    }
  }
);

export const selectRoutedPodcastRanksTotalDownloads = createSelector(
  selectRoutedPodcastRanks,
  (podcastRanks: PodcastRanks): number => {
    return podcastRanks ? podcastRanks.ranks.reduce((acc, rank) => acc += rank.total, 0) : undefined;
  }
);
