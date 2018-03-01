import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { RouterModel } from '../models';

export const selectRouter = createSelector(selectAppState, (state: RootState) => state.router);
export const selectMetricsTypeRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.metricsType);
export const selectPodcastRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.podcastSeriesId);
export const selectChartTypeRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.chartType);
export const selectIntervalRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.interval);
export const selectPageRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.page);
export const selectStandardRangeRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.standardRange);
export const selectBeginDateRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.beginDate);
export const selectEndDateRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.endDate);
export const selectChartPodcastRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.chartPodcast);
export const selectChartedEpisodeIdsRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.episodeIds);
