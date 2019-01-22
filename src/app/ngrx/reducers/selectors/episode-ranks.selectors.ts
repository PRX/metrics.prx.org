import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeRanks from '../episode-ranks.reducer';
import {
  EpisodeRanks,
  Rank,
  episodeRanksKey,
  GroupType,
  IntervalModel,
  GroupCharted,
  ChartType,
  CHARTTYPE_HORIZBAR,
  GROUPTYPE_GEOSUBDIV,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_GEOMETRO
} from '../models';
import {
  selectChartTypeRoute,
  selectGroupRoute,
  selectFilterRoute,
  selectIntervalRoute,
  selectBeginDateRoute,
  selectEndDateRoute } from './router.selectors';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import { aggregateTotals, aggregateIntervals, aggregateTotalDownloads } from '../../../shared/util/chart.util';
import { selectEpisodeSelectedEpisodeGuids } from './episode-select.selectors';
import { selectRoutedGroupCharted } from './group-charted.selectors';

export const selectEpisodeRanksState = createFeatureSelector<fromEpisodeRanks.State>('episodeRanks');

export const selectEpisodeRanksKeys = createSelector(
  selectEpisodeRanksState,
  fromEpisodeRanks.selectEpisodeRanksKeys
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
  selectEpisodeSelectedEpisodeGuids,
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
      guids.filter(guid => episodeRanksEntities[episodeRanksKey(guid, group, filter, interval, beginDate, endDate)])
        .map(guid => episodeRanksEntities[episodeRanksKey(guid, group, filter, interval, beginDate, endDate)]);
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

export const selectSelectedEpisodesRanksError = createSelector(
  selectSelectedEpisodesRanks,
  (ranks: EpisodeRanks[]) => ranks && ranks.filter((r: EpisodeRanks) => r.error)
);

export const selectNestedEpisodesRanks = createSelector(
  selectEpisodeSelectedEpisodeGuids,
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
      guids.filter(guid => episodeRanksEntities[episodeRanksKey(guid, GROUPTYPE_GEOSUBDIV, filter, interval, beginDate, endDate)])
        .map(guid => episodeRanksEntities[episodeRanksKey(guid, GROUPTYPE_GEOSUBDIV, filter, interval, beginDate, endDate)]);
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

export const selectNestedEpisodesRanksError = createSelector(
  selectNestedEpisodesRanks,
  (ranks: EpisodeRanks[]) => ranks && ranks.filter((r: EpisodeRanks) => r.error)
);

export const selectSelectedEpisodeRanksChartMetrics = createSelector(
  selectSelectedEpisodesRanks,
  selectRoutedGroupCharted,
  selectGroupRoute,
  selectChartTypeRoute,
  (episodeRanks: EpisodeRanks[],
   groupsCharted: GroupCharted[],
   groupRoute: GroupType,
   chartType: ChartType): CategoryChartModel[] | TimeseriesChartModel[] => {
    // if (podcastRanks && podcastRanks.ranks && podcastRanks.downloads) {
      if (chartType === CHARTTYPE_HORIZBAR) {
        const totals = aggregateTotals(episodeRanks, 0, groupsCharted);
        return totals && totals.filter(row => row.charted).map(t => ({label: t.label, value: t.value}));
      } else {
        // TODO: filter out Other when === 0
        return aggregateIntervals(episodeRanks, groupsCharted);
        // return podcastRanks.ranks
        //   .filter((rank: Rank) => rank.label !== 'Other' || rank.total !== 0)
        //   .map((rank: Rank, i: number) => {
        //     const downloads = podcastRanks.downloads.map(data => [data[0], data[1][i]]);
        //     return {
        //       data: mapMetricsToTimeseriesData(downloads),
        //       label: rank.label,
        //       color: rank.label === 'Other' ? neutralColor : getColor(i)
        //     };
        //   })
        //   .filter((entry: TimeseriesChartModel) => {
        //     return groupsCharted.find(g => g.charted && g.groupName === entry.label &&
        //       ((groupRoute !== GROUPTYPE_GEOCOUNTRY &&
        //         groupRoute !== GROUPTYPE_GEOMETRO) || entry.label !== 'Other'));
        //   });
      }
    }
  // }
);

export const selectNestedEpisodesRanksChartMetrics = createSelector(
  selectNestedEpisodesRanks,
  (episodeRanks: EpisodeRanks[]): TimeseriesChartModel[] => {
    // TODO: filter Other
    return aggregateIntervals(episodeRanks);
  }
);

export const selectSelectedEpisodesRanksTotalDownloads = createSelector(
  selectSelectedEpisodesRanks,
  (episodeRanks: EpisodeRanks[]): number => aggregateTotalDownloads(episodeRanks)
);
