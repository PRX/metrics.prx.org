import { createSelector } from '@ngrx/store';
import { selectRouter } from './router.selectors';
import { selectEpisodeError } from './episode.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeMetricsError } from './episode-metrics.selectors';
import { selectPodcastMetricsError } from './podcast-metrics.selectors';
import { selectRoutedPodcastRanksError, selectNestedPodcastRanksError } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsError, selectNestedPodcastTotalsError } from './podcast-totals.selectors';
import * as ACTIONS from '../../actions';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { RouterParams, METRICSTYPE_DOWNLOADS, GROUPTYPE_GEOSUBDIV } from '../models';

// this feels like it's starting to cross a boundary of responsibility here, so it seems important to note that
// these actions are not being dispatched by the reducers/selectors
// rather, these actions have parameters that are dependent on the router state,
// so the components that initiate these actions are using selectors on the state to build the actions
// that is all we're doing, producing actions, plain objects (to be dispatched elsewhere)
// reducers don't dispatch actions, reducers are pure functions and dispatching actions would be a side effect

export const select500ErrorReloadActions =
  createSelector(selectRouter,
    selectPodcastError,
    selectEpisodeError,
    selectPodcastMetricsError,
    selectEpisodeMetricsError,
    selectRoutedPodcastRanksError,
    selectRoutedPodcastTotalsError,
  (routerParams: RouterParams,
   podcastError: any,
   episodeError: any,
   podcastMetricsErrors: PodcastMetricsModel[],
   episodeMetricsErrors: EpisodeMetricsModel[],
   podcastRanksError: any,
   podcastTotalsError: any) => {
    let actions = [];
    if (podcastError && podcastError.status === 500) {
      actions.push(new ACTIONS.CastlePodcastPageLoadAction({page: 1, all: true}));
    }
    if (routerParams.metricsType === METRICSTYPE_DOWNLOADS) {
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
    } else {
      if (podcastRanksError && podcastRanksError.status === 500) {
        const { podcastId, group, interval, beginDate, endDate } = routerParams;
        actions.push(new ACTIONS.CastlePodcastRanksLoadAction({
          id: podcastId,
          group,
          interval,
          beginDate,
          endDate
        }));
      }
      if (podcastTotalsError && podcastTotalsError.status === 500) {
        const { podcastId, group, beginDate, endDate } = routerParams;
        actions.push(new ACTIONS.CastlePodcastTotalsLoadAction({
          id: podcastId,
          group,
          beginDate,
          endDate
        }));
      }
    }
    return actions;
  });

export const selectNested500ErrorReloadActions = createSelector(selectRouter, selectNestedPodcastRanksError, selectNestedPodcastTotalsError,
  (routerParams: RouterParams, ranksError: any, totalsError: any) => {
  const actions = [];
    if (ranksError && ranksError.status === 500) {
      actions.push(new ACTIONS.CastlePodcastRanksLoadAction({
        id: routerParams.podcastId,
        group: GROUPTYPE_GEOSUBDIV,
        filter: routerParams.filter,
        interval: routerParams.interval,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate
      }));
    }
    if (totalsError && totalsError.status === 500) {
      actions.push(new ACTIONS.CastlePodcastTotalsLoadAction({
        id: routerParams.podcastId,
        group: GROUPTYPE_GEOSUBDIV,
        filter: routerParams.filter,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate
      }));
    }
    return actions;
  });
