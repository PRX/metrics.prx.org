import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { RouterParams, GROUPTYPE_GEOCOUNTRY } from '../models';

export const selectRouter = createSelector(selectAppState, (state: RootState) => state.router);
export const selectPodcastRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.podcastId);
export const selectMetricsTypeRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.metricsType);
export const selectGroupRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.group);
export const selectFilterRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.filter);
export const selectIsGroupGeoCountry = createSelector(selectRouter,
  (routerParams: RouterParams) => routerParams.group === GROUPTYPE_GEOCOUNTRY);
export const selectChartTypeRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.chartType);
export const selectIntervalRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.interval);
export const selectPageRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.episodePage);
export const selectStandardRangeRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.standardRange);
export const selectBeginDateRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.beginDate);
export const selectEndDateRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.endDate);
