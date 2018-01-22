import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { FilterReducer, FilterModel } from './filter.reducer';
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
  filter: FilterModel;
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
  filter: FilterReducer,
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
export const selectPodcastRoute = createSelector(selectRouter, (routerState: RouterModel) => routerState.podcastSeriesId);

export const selectFilter = createSelector(selectAppState, (state: RootState) => state.filter);
export const selectPageFilter = createSelector(selectFilter, (filter: FilterModel) => filter.page);
export const selectIntervalFilter = createSelector(selectFilter, (filter: FilterModel) => filter.interval);
export const selectChartTypeFilter = createSelector(selectFilter, (filter: FilterModel) => filter.chartType);

export const selectAccountState = createSelector(selectAppState, (state: RootState) => state.account);
export const selectAccount = createSelector(selectAccountState, getAccountEntity);
export const selectAccountError = createSelector(selectAccountState, getAccountError);

export const selectPodcastState = createSelector(selectAppState, (state: RootState) => state.podcasts);
export const selectPodcastEntities = createSelector(selectPodcastState, getPodcastEntities);
export const selectPodcasts = createSelector(selectPodcastEntities, entities => {
  return Object.keys(entities).map(seriesId => entities[parseInt(seriesId, 10)]);
});
export const selectPodcastsError = createSelector(selectPodcastState, getPodcastError);
export const selectSelectedPodcast = createSelector(selectPodcastEntities, selectPodcastRoute, (entities, podcastSeriesId) => entities[podcastSeriesId]);

export const selectEpisodeState = createSelector(selectAppState, (state: RootState) => state.episodes);
export const selectEpisodeEntities = createSelector(selectEpisodeState, getEpisodeEntities);
export const selectEpisodes = createSelector(selectEpisodeEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const selectPodcastMetrics = createSelector(selectAppState, (state: RootState) => state.podcastMetrics);
export const selectPodcastMetricsFilteredAverage = createSelector(selectPodcastMetrics, selectFilter,
  (metrics: PodcastMetricsModel[], filter: FilterModel) => {
    // TODO: should zero value data points be included in the average? for some of these zeroes, there just is no data
    // for episodes, including the zero data points before the release date brings the average down
    const filteredMetrics = metricsUtil.findPodcastMetrics(filter, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(filter.interval, 'downloads')];
      return Math.round(metricsUtil.getTotal(data) / (data && data.length || 1));
    }
  });
export const selectPodcastMetricsFilteredTotal = createSelector(selectPodcastMetrics, selectFilter,
  (metrics: PodcastMetricsModel[], filter: FilterModel) => {
    const filteredMetrics = metricsUtil.findPodcastMetrics(filter, metrics);
    if (filteredMetrics) {
      const data = filteredMetrics[getMetricsProperty(filter.interval, 'downloads')];
      return metricsUtil.getTotal(data);
    }
  });

export const selectEpisodeMetrics = createFeatureSelector<EpisodeMetricsModel[]>('episodeMetrics');
