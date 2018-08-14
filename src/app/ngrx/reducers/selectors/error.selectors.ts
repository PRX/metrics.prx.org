import { createSelector } from '@ngrx/store';
import { selectRouter } from './router.selectors';
import { selectEpisodeError } from './episode.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeMetricsError } from './episode-metrics.selectors';
import { selectPodcastMetricsError } from './podcast-metrics.selectors';
import * as ACTIONS from '../../actions';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { RouterParams } from '../models';

export const select500ErrorReloadActions =
  createSelector(selectRouter, selectPodcastError, selectEpisodeError, selectPodcastMetricsError, selectEpisodeMetricsError,
  (routerParams: RouterParams,
   podcastError: any,
   episodeError: any,
   podcastMetricsErrors: PodcastMetricsModel[],
   episodeMetricsErrors: EpisodeMetricsModel[]) => {
    let actions = [];
    if (podcastError && podcastError.status === 500) {
      actions.push(new ACTIONS.CastlePodcastPageLoadAction({page: 1, all: true}));
    }
    if (episodeError && episodeError.status === 500) {
      actions.push(new ACTIONS.CastleEpisodePageLoadAction({podcastId: routerParams.podcastId, page: 1, all: true}));
    }
    if (podcastMetricsErrors && podcastMetricsErrors.length) {
      actions = actions.concat(podcastMetricsErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastlePodcastMetricsLoadAction({
          id: m.id,
          metricsType: routerParams.metricsType,
          interval: routerParams.interval,
          beginDate: routerParams.beginDate,
          endDate: routerParams.endDate
        })));
    }
    if (episodeMetricsErrors && episodeMetricsErrors.length) {
      actions = actions.concat(episodeMetricsErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastleEpisodeMetricsLoadAction({
          podcastId: m.podcastId,
          guid: m.guid,
          page: m.page,
          metricsType: routerParams.metricsType,
          interval: routerParams.interval,
          beginDate: routerParams.beginDate,
          endDate: routerParams.endDate
        })));
    }
    return actions;
  });
