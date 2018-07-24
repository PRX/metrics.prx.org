import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { RouterParams } from '../models';

export const selectRouter = createSelector(selectAppState, (state: RootState) => state.router);
export const selectMetricsTypeRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.metricsType);
export const selectPodcastRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.podcastSeriesId);
export const selectChartTypeRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.chartType);
export const selectIntervalRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.interval);
export const selectPageRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.episodePage);
export const selectStandardRangeRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.standardRange);
export const selectBeginDateRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.beginDate);
export const selectEndDateRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.endDate);
export const selectChartPodcastRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.chartPodcast);
export const selectChartedEpisodeIdsRoute = createSelector(selectRouter, (routerParams: RouterParams) => routerParams.episodeIds);
