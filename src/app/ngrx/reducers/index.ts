import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { AccountReducer } from './account.reducer';
import { PodcastReducer } from './podcast.reducer';
import { EpisodeReducer } from './episode.reducer';
import { PodcastMetricsReducer, PodcastMetricsModel } from './podcast-metrics.reducer';
import { EpisodeMetricsReducer, EpisodeMetricsModel } from './episode-metrics.reducer';
import { RecentEpisodeReducer } from './recent-episode.reducer';
import { AccountState, getAccountEntity, getAccountError } from './account.reducer';
import { PodcastModel, PodcastState, getPodcastEntities, getPodcastsLoaded, getPodcastsLoading, getPodcastsError } from './podcast.reducer';
import { EpisodeModel, EpisodeState, getEpisodeEntities, getEpisodesLoaded, getEpisodesLoading, getEpisodesError } from './episode.reducer';
import { RecentEpisodeState, getRecentEpisodeEntities, getRecentEpisodeLoaded,
  getRecentEpisodeLoading, getRecentEpisodeError } from './recent-episode.reducer';
import { CustomRouterReducer } from './router.reducer';

import { RouterModel, getMetricsProperty } from './models';
import * as metricsUtil from '../../shared/util/metrics.util';

export interface RootState {
  routerSerializer: RouterReducerState<RouterModel>;
  router: RouterModel;
  account: AccountState;
  podcasts: PodcastState;
  episodes: EpisodeState;
  podcastMetrics: PodcastMetricsModel[];
  episodeMetrics: EpisodeMetricsModel[];
  recentEpisodes: RecentEpisodeState;
}

// TypeScript is complaining about this ActionReducerMap again, not sure why ugh
export const reducers: ActionReducerMap<RootState> = {
  routerSerializer: routerReducer,
  router: CustomRouterReducer,
  account: AccountReducer,
  podcasts: PodcastReducer,
  episodes: EpisodeReducer,
  podcastMetrics: PodcastMetricsReducer,
  episodeMetrics: EpisodeMetricsReducer,
  recentEpisodes: RecentEpisodeReducer
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
export const selectPodcastsLoaded = createSelector(selectPodcastState, getPodcastsLoaded);
export const selectPodcastsLoading = createSelector(selectPodcastState, getPodcastsLoading);
export const selectPodcastsError = createSelector(selectPodcastState, getPodcastsError);
export const selectSelectedPodcast = createSelector(selectPodcastEntities, selectPodcastRoute,
  (entities, podcastSeriesId) => entities[podcastSeriesId]);

export const selectEpisodeState = createSelector(selectAppState, (state: RootState) => state.episodes);
export const selectEpisodeEntities = createSelector(selectEpisodeState, getEpisodeEntities);
export const selectEpisodes = createSelector(selectEpisodeEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});
export const selectEpisodesLoaded = createSelector(selectEpisodeState, getEpisodesLoaded);
export const selectEpisodesLoading = createSelector(selectEpisodeState, getEpisodesLoading);
export const selectEpisodesError = createSelector(selectEpisodeState, getEpisodesError);
export const selectSelectedPageEpisodes = createSelector(selectEpisodes, selectPageRoute, (episodes: EpisodeModel[], page: number) => {
  return episodes.filter(episode => episode.page === page);
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
export const selectPodcastMetricsLoading = createSelector(selectPodcastMetrics, (metrics: PodcastMetricsModel[]) => {
  return metrics.some((m: PodcastMetricsModel) => m.loading);
});
export const selectPodcastMetricsLoaded = createSelector(selectPodcastMetrics, (metrics: PodcastMetricsModel[]) => {
  return metrics.every((m: PodcastMetricsModel) => m.loaded || m.loaded === undefined);
});
const errorType = (code) => code === 401 ? 'Authorization' : 'Unknown';
export const selectPodcastMetricsError = createSelector(selectPodcastMetrics, (metrics: PodcastMetricsModel[]) => {
  return metrics.filter(m => m.error).map(m => {
    return `${errorType(m.error.status)} error occurred while requesting podcast metrics`;
  });
});

export const selectEpisodeMetrics = createFeatureSelector<EpisodeMetricsModel[]>('episodeMetrics');
export const selectEpisodeMetricsLoading = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.some((m: EpisodeMetricsModel) => m.loading);
});
export const selectEpisodeMetricsLoaded = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.every((m: EpisodeMetricsModel) => m.loaded || m.loaded === undefined);
});
export const selectEpisodeMetricsError = createSelector(selectEpisodeMetrics, (metrics: EpisodeMetricsModel[]) => {
  return metrics.filter(m => m.error).map(m => {
    return `${errorType(m.error.status)} error occurred while requesting episode metrics for ${m.guid}`;
  });
});

export const selectRecentEpisodeState = createSelector(selectAppState, (state: RootState) => state.recentEpisodes);
export const selectRecentEpisodeEntities = createSelector(selectRecentEpisodeState, getRecentEpisodeEntities);
export const selectRecentEpisode = createSelector(selectRecentEpisodeEntities, selectPodcastRoute, (entities, seriesId): EpisodeModel => {
  return entities[seriesId];
});
export const selectRecentEpisodeLoaded = createSelector(selectRecentEpisodeState, getRecentEpisodeLoaded);
export const selectRecentEpisodeLoading = createSelector(selectRecentEpisodeState, getRecentEpisodeLoading);
export const selectRecentEpisodeError = createSelector(selectRecentEpisodeState, getRecentEpisodeError);

export const selectPodcastProfileMetrics = createSelector(selectPodcastRoute, selectPodcastMetrics,
  (podcastSeriesId: number, podcastMetrics: PodcastMetricsModel[]) => {
  const metric = podcastMetrics.find((m: PodcastMetricsModel) => m.seriesId === podcastSeriesId);
  if (metric) {
    return {
      allTimeDownloads: metric.allTimeDownloads,
      previous7days: metric.previous7days,
      this7days: metric.this7days,
      yesterday: metric.yesterday,
      today: metric.today
    };
  }
});
export const selectRecentEpisodeProfileMetrics = createSelector(selectRecentEpisode, selectEpisodeMetrics,
  (episode: EpisodeModel, episodeMetrics: EpisodeMetricsModel[]) => {
  if (episode) {
    const metric = episodeMetrics.find((m: EpisodeMetricsModel) => m.seriesId === episode.seriesId && m.id === episode.id);
    if (metric) {
      return {
        allTimeDownloads: metric.allTimeDownloads,
        previous7days: metric.previous7days,
        this7days: metric.this7days,
        yesterday: metric.yesterday,
        today: metric.today
      };
    }
  }
});

export const selectCmsLoading = createSelector(selectEpisodesLoading, selectPodcastsLoading, (episodes, podcasts) => episodes || podcasts);
export const selectCastleLoading = createSelector(selectEpisodeMetricsLoading, selectPodcastMetricsLoading,
  (episodes, podcasts) => episodes || podcasts);
export const selectLoading = createSelector(selectCmsLoading, selectCastleLoading, (cms, castle) => cms || castle);
export const selectCmsLoaded = createSelector(selectEpisodesLoaded, selectPodcastsLoaded, (episodes, podcasts) => episodes && podcasts);
export const selectCastleLoaded = createSelector(selectEpisodeMetricsLoaded, selectPodcastMetricsLoaded,
  (episodes, podcasts) => episodes && podcasts);
export const selectLoaded = createSelector(selectCmsLoaded, selectCastleLoaded, (cms, castle) => cms && castle);

export const selectCmsErrors = createSelector(selectPodcastsError, selectEpisodesError, (podcastError, episodeError) => {
  const errors = [];
  if (podcastError) {
    errors.push(`${errorType(podcastError.code)} error occurred while requesting podcast series`);
  }
  if (episodeError) {
    errors.push(`${errorType(episodeError.code)} error occurred while requesting episode data`);
  }
  return errors;
});
export const selectCastleErrors = createSelector(selectPodcastMetricsError, selectEpisodeMetricsError,
  (podcasts, episodes) => podcasts.concat(episodes));
export const selectErrors = createSelector(selectCmsErrors, selectCastleErrors, (cms, castle) => cms.concat(castle));
