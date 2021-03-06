import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeTotals from '../episode-totals.reducer';
import { EpisodeTotals, episodeTotalsId,
  TotalsTableRow, GroupCharted,
  GroupType, GROUPTYPE_GEOSUBDIV } from '../models';
import { selectGroupRoute, selectFilterRoute, selectBeginDateRoute, selectEndDateRoute } from './router.selectors';
import { selectAggregateSelectedEpisodeGuids } from './episode-select.selectors';
import { aggregateTotalsTable, aggregateTotalDownloads } from '../../../shared/util/chart.util';
import { selectRoutedGroupCharted } from './group-charted.selectors';

export const selectEpisodeTotalsState = createFeatureSelector<fromEpisodeTotals.State>('episodeTotals');

export const selectEpisodeTotalsIds = createSelector(
  selectEpisodeTotalsState,
  fromEpisodeTotals.selectEpisodeTotalsIds
);
export const selectEpisodeTotalsEntities = createSelector(
  selectEpisodeTotalsState,
  fromEpisodeTotals.selectEpisodeTotalsEntities
);
export const selectAllEpisodeTotals = createSelector(
  selectEpisodeTotalsState,
  fromEpisodeTotals.selectAllEpisodeTotals
);

export const selectAllEpisodeTotalsErrors = createSelector(
  selectAllEpisodeTotals,
  (totals: EpisodeTotals[]) => {
    return totals.filter(t => t.error);
  });

export const selectAllEpisodeTotalsLoading = createSelector(selectAllEpisodeTotals, (totals: EpisodeTotals[]) => {
  return totals.some((t: EpisodeTotals) => t.loading);
});
export const selectAllEpisodeTotalsLoaded = createSelector(selectAllEpisodeTotals, (totals: EpisodeTotals[]) => {
  return totals.every((t: EpisodeTotals) => t.loaded);
});

export const selectSelectedEpisodesTotals = createSelector(
  selectAggregateSelectedEpisodeGuids,
  selectGroupRoute,
  selectFilterRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectEpisodeTotalsEntities,
  (guids, group: GroupType, filter: string, beginDate: Date, endDate: Date, episodeTotalsEntities): EpisodeTotals[] => {
    return guids &&
      guids.filter(guid => episodeTotalsEntities[episodeTotalsId(guid, group, filter, beginDate, endDate)])
        .map(guid => episodeTotalsEntities[episodeTotalsId(guid, group, filter, beginDate, endDate)]);
  }
);

export const selectSelectedEpisodesTotalsLoading = createSelector(
  selectSelectedEpisodesTotals,
  (totals: EpisodeTotals[]) => !totals || totals.some((t: EpisodeTotals) => t.loading)
);

export const selectSelectedEpisodesTotalsLoaded = createSelector(
  selectSelectedEpisodesTotals,
  (totals: EpisodeTotals[]) => totals && totals.every((t: EpisodeTotals) => t.loaded)
);

export const selectSelectedEpisodesTotalsErrors = createSelector(
  selectSelectedEpisodesTotals,
  (totals: EpisodeTotals[]) => totals && totals.filter((t: EpisodeTotals) => t.error)
);

export const selectNestedEpisodesTotals = createSelector(
  selectAggregateSelectedEpisodeGuids,
  selectFilterRoute,
  selectBeginDateRoute,
  selectEndDateRoute,
  selectEpisodeTotalsEntities,
  (guids: string[], filter: string, beginDate: Date, endDate: Date, episodeTotalsEntities): EpisodeTotals[] => {
    return guids &&
      guids.filter(guid => episodeTotalsEntities[episodeTotalsId(guid, GROUPTYPE_GEOSUBDIV, filter, beginDate, endDate)])
        .map(guid => episodeTotalsEntities[episodeTotalsId(guid, GROUPTYPE_GEOSUBDIV, filter, beginDate, endDate)]);
  }
);

export const selectNestedEpisodesTotalsLoading = createSelector(
  selectNestedEpisodesTotals,
  (totals: EpisodeTotals[]) => !totals || totals.some((t: EpisodeTotals) => t.loading)
);

export const selectNestedEpisodesTotalsLoaded = createSelector(
  selectNestedEpisodesTotals,
  (totals: EpisodeTotals[]) => totals && totals.every((t: EpisodeTotals) => t.loaded)
);

export const selectNestedEpisodesTotalsErrors = createSelector(
  selectNestedEpisodesTotals,
  (totals: EpisodeTotals[]) => totals && totals.filter((t: EpisodeTotals) => t.error)
);

export const selectSelectedEpisodesTotalsTotalDownloads = createSelector(
  selectSelectedEpisodesTotals,
  (episodeTotals: EpisodeTotals[]): number => aggregateTotalDownloads(episodeTotals)
);

export const selectSelectedEpisodesTotalsTableMetrics = createSelector(
  selectSelectedEpisodesTotals,
  selectSelectedEpisodesTotalsTotalDownloads,
  selectRoutedGroupCharted,
  (episodeTotals: EpisodeTotals[], totalDownloads: number, groupsCharted: GroupCharted[]): TotalsTableRow[] => {
    return aggregateTotalsTable(episodeTotals, totalDownloads, groupsCharted);
  });

export const selectNestedEpisodesTotalsTableMetrics = createSelector(
  selectNestedEpisodesTotals,
  (episodeTotals: EpisodeTotals[]): TotalsTableRow[] => {
    return aggregateTotalsTable(episodeTotals);
  });
