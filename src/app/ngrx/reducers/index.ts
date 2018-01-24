import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { AccountReducer } from './account.reducer';
import { PodcastReducer } from './podcast.reducer';
import { EpisodeReducer } from './episode.reducer';
import { PodcastMetricsReducer, PodcastMetricsModel } from './podcast-metrics.reducer';
import { EpisodeMetricsReducer, EpisodeMetricsModel } from './episode-metrics.reducer';
import { AccountState, getAccountEntity, getAccountError } from './account.reducer';
import { PodcastState, getPodcastEntities, getPodcastError } from './podcast.reducer';
import { EpisodeState, getEpisodeEntities } from './episode.reducer';
import { RouterModel } from './router.serializer';
import { CustomRouterReducer } from './router.reducer';

import { getMetricsProperty } from './models/metrics.type';
import * as metricsUtil from '../../shared/util/metrics.util';

export interface RootState {
  routerSerializer: RouterReducerState<RouterModel>;
  router: RouterModel;
  account: AccountState;
  podcasts: PodcastState;
  episodes: EpisodeState;
  podcastMetrics: PodcastMetricsModel[];
  episodeMetrics: EpisodeMetricsModel[];
}

// TypeScript is complaining about this ActionReducerMap again, not sure why ugh
export const reducers: ActionReducerMap<RootState> = {
  routerSerializer: routerReducer,
  router: CustomRouterReducer,
  account: AccountReducer,
  podcasts: PodcastReducer,
  episodes: EpisodeReducer,
  podcastMetrics: PodcastMetricsReducer,
  episodeMetrics: EpisodeMetricsReducer
};

export { CustomSerializer } from './router.serializer';

export const selectAppState = (state: RootState) => state;

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

export const selectAccountState = createSelector(selectAppState, (state: RootState) => state.account);
export const selectAccount = createSelector(selectAccountState, getAccountEntity);
export const selectAccountError = createSelector(selectAccountState, getAccountError);

export const selectPodcastState = createSelector(selectAppState, (state: RootState) => state.podcasts);
export const selectPodcastEntities = createSelector(selectPodcastState, getPodcastEntities);
export const selectPodcasts = createSelector(selectPodcastEntities, entities => {
  return Object.keys(entities).map(seriesId => entities[parseInt(seriesId, 10)]);
});
export const selectPodcastsError = createSelector(selectPodcastState, getPodcastError);
export const selectSelectedPodcast = createSelector(selectPodcastEntities, selectPodcastRoute,
  (entities, podcastSeriesId) => entities[podcastSeriesId]);

export const selectEpisodeState = createSelector(selectAppState, (state: RootState) => state.episodes);
export const selectEpisodeEntities = createSelector(selectEpisodeState, getEpisodeEntities);
export const selectEpisodes = createSelector(selectEpisodeEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const selectPodcastMetrics = createSelector(selectAppState, (state: RootState) => state.podcastMetrics);
export const selectPodcastMetricsFilteredAverage = createSelector(selectPodcastMetrics, selectRouter,
  (metrics: PodcastMetricsModel[], routerState: RouterModel) => {
    // TODO: should zero value data points be included in the average? for some of these zeroes, there just is no data
    // for episodes, including the zero data points before the release date brings the average down
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerState, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerState.interval, 'downloads')];
      return Math.round(metricsUtil.getTotal(data) / (data && data.length || 1));
    }
  });
export const selectPodcastMetricsFilteredTotal = createSelector(selectPodcastMetrics, selectRouter,
  (metrics: PodcastMetricsModel[], routerState: RouterModel) => {
    const filteredMetrics = metricsUtil.findPodcastMetrics(routerState, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(routerState.interval, 'downloads')];
      return metricsUtil.getTotal(data);
    }
  });

export const selectEpisodeMetrics = createFeatureSelector<EpisodeMetricsModel[]>('episodeMetrics');
