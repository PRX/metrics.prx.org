import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeRanks from '../episode-ranks.reducer';
import {
  EpisodeRanks,
  episodeRanksId,
  GroupType,
  IntervalModel,
  GroupCharted,
  ChartType,
  CHARTTYPE_HORIZBAR,
  GROUPTYPE_GEOSUBDIV
} from '../models';
import {
  selectChartTypeRoute,
  selectGroupRoute,
  selectFilterRoute,
  selectIntervalRoute,
  selectBeginDateRoute,
  selectEndDateRoute } from './router.selectors';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import { aggregateTotalsBarChart, aggregateIntervals, aggregateTotalDownloads } from '../../../shared/util/chart.util';
import { selectAggregateSelectedEpisodeGuids } from './episode-select.selectors';
import { selectRoutedGroupCharted } from './group-charted.selectors';

export const selectEpisodeRanksState = createFeatureSelector<fromEpisodeRanks.State>('episodeRanks');

export const selectEpisodeRanksIds = createSelector(
  selectEpisodeRanksState,
  fromEpisodeRanks.selectEpisodeRanksIds
);
export const selectEpisodeRanksEntities = createSelector(
  selectEpisodeRanksState,
  fromEpisodeRanks.selectEpisodeRanksEntities
);
export const selectAllEpisodeRanks = createSelector(
  selectEpisodeRanksState,
  fromEpisodeRanks.selectAllEpisodeRanks
);

export const selectAllEpisodeRanksLoading = createSelector(selectAllEpisodeRanks, (ranks: EpisodeRanks[]) => {
  return ranks.some((r: EpisodeRanks) => r.loading);
});
export const selectAllEpisodeRanksLoaded = createSelector(selectAllEpisodeRanks, (ranks: EpisodeRanks[]) => {
  return ranks.every((r: EpisodeRanks) => r.loaded);
});
export const selectAllEpisodeRanksErrors = createSelector(selectAllEpisodeRanks, (ranks: EpisodeRanks[]) => {
  return ranks.filter((r: EpisodeRanks) => r.error);
});

export const selectSelectedEpisodesRanks = createSelector(
  selectAggregateSelectedEpisodeGuids,
  selectGroupRoute,
  selectFilterRoute,
  selectIntervalRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectEpisodeRanksEntities,
  (guids: string[],
   group: GroupType,
   filter: string,
   interval: IntervalModel,
   beginDate: Date,
   endDate: Date,
   episodeRanksEntities): EpisodeRanks[] => {
    return guids &&
      guids.filter(guid => episodeRanksEntities[episodeRanksId(guid, group, filter, interval, beginDate, endDate)])
        .map(guid => episodeRanksEntities[episodeRanksId(guid, group, filter, interval, beginDate, endDate)]);
  }
);

export const selectSelectedEpisodesRanksLoading = createSelector(
  selectSelectedEpisodesRanks,
  (ranks: EpisodeRanks[]) => !ranks || ranks.some((r: EpisodeRanks) => r.loading)
);

export const selectSelectedEpisodesRanksLoaded = createSelector(
  selectSelectedEpisodesRanks,
  (ranks: EpisodeRanks[]) => ranks && ranks.every((r: EpisodeRanks) => r.loaded)
);

export const selectSelectedEpisodesRanksErrors = createSelector(
  selectSelectedEpisodesRanks,
  (ranks: EpisodeRanks[]) => ranks && ranks.filter((r: EpisodeRanks) => r.error)
);

export const selectNestedEpisodesRanks = createSelector(
  selectAggregateSelectedEpisodeGuids,
  selectFilterRoute,
  selectIntervalRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectEpisodeRanksEntities,
  (guids: string[],
   filter: string,
   interval: IntervalModel,
   beginDate: Date,
   endDate: Date,
   episodeRanksEntities): EpisodeRanks[] => {
    return guids &&
      guids.filter(guid => episodeRanksEntities[episodeRanksId(guid, GROUPTYPE_GEOSUBDIV, filter, interval, beginDate, endDate)])
        .map(guid => episodeRanksEntities[episodeRanksId(guid, GROUPTYPE_GEOSUBDIV, filter, interval, beginDate, endDate)]);
  }
);

export const selectNestedEpisodesRanksLoading = createSelector(
  selectNestedEpisodesRanks,
  (ranks: EpisodeRanks[]) => !ranks || ranks.some((r: EpisodeRanks) => r.loading)
);

export const selectNestedEpisodesRanksLoaded = createSelector(
  selectNestedEpisodesRanks,
  (ranks: EpisodeRanks[]) => ranks && ranks.every((r: EpisodeRanks) => r.loaded)
);

export const selectNestedEpisodesRanksErrors = createSelector(
  selectNestedEpisodesRanks,
  (ranks: EpisodeRanks[]) => ranks && ranks.filter((r: EpisodeRanks) => r.error)
);

export const selectSelectedEpisodeRanksChartMetrics = createSelector(
  selectSelectedEpisodesRanks,
  selectRoutedGroupCharted,
  selectChartTypeRoute,
  (episodeRanks: EpisodeRanks[],
   groupsCharted: GroupCharted[],
   chartType: ChartType): CategoryChartModel[] | TimeseriesChartModel[] => {
    if (chartType === CHARTTYPE_HORIZBAR) {
      return aggregateTotalsBarChart(episodeRanks, groupsCharted);
    } else {
      return aggregateIntervals(episodeRanks, groupsCharted);
    }
  }
);

export const selectNestedEpisodesRanksChartMetrics = createSelector(
  selectNestedEpisodesRanks,
  (episodeRanks: EpisodeRanks[]): TimeseriesChartModel[] => {
    return aggregateIntervals(episodeRanks);
  }
);

export const selectSelectedEpisodesRanksTotalDownloads = createSelector(
  selectSelectedEpisodesRanks,
  (episodeRanks: EpisodeRanks[]): number => aggregateTotalDownloads(episodeRanks)
);
