import { createSelector, Action } from '@ngrx/store';
import { selectRouter } from './router.selectors';
import { selectEpisodeError } from './episode.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeDownloadsError } from './episode-downloads.selectors';
import { selectPodcastDownloadsError } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksError, selectNestedPodcastRanksError } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsError, selectNestedPodcastTotalsError } from './podcast-totals.selectors';
import { selectAggregateSelectedEpisodeGuids } from './episode-select.selectors';
import { selectSelectedEpisodesRanksErrors, selectNestedEpisodesRanksErrors } from './episode-ranks.selectors';
import { selectSelectedEpisodesTotalsErrors, selectNestedEpisodesTotalsErrors } from './episode-totals.selectors';
import { selectSelectedEpisodeDropdayErrors } from './episode-dropday.selectors';
import { selectPodcastListenersError } from './podcast-listeners.selectors';
import * as ACTIONS from '../../actions';
import {
  RouterParams,
  EpisodeDownloads,
  PodcastDownloads,
  EpisodeDropday,
  GROUPTYPE_GEOSUBDIV,
  EPISODE_PAGE_SIZE,
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_DROPDAY,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_TRAFFICSOURCES,
  PodcastListeners,
  METRICSTYPE_LISTENERS
} from '../models';

// this feels like it's starting to cross a boundary of responsibility here, so it seems important to note that
// these actions are not being dispatched by the reducers/selectors
// rather, these actions have parameters that are dependent on the router state,
// so the components that initiate these actions are using selectors on the state to build the actions
// that is all we're doing, producing actions, plain objects (to be dispatched elsewhere)
// reducers don't dispatch actions, reducers are pure functions and dispatching actions would be a side effect

export const selectDownload500ErrorReloadActions = createSelector(
  selectRouter,
  selectPodcastDownloadsError,
  selectEpisodeDownloadsError,
  (routerParams: RouterParams, podcastDownloadsErrors: PodcastDownloads[], episodeDownloadsErrors: EpisodeDownloads[]) => {
    let actions = [];
    const { interval, beginDate, endDate } = routerParams;
    if (podcastDownloadsErrors && podcastDownloadsErrors.length) {
      actions = actions.concat(
        podcastDownloadsErrors
          .filter(m => m.error && m.error.status === 500)
          .map(m =>
            ACTIONS.CastlePodcastDownloadsLoad({
              id: m.id,
              interval,
              beginDate,
              endDate
            })
          )
      );
    }
    if (episodeDownloadsErrors && episodeDownloadsErrors.length) {
      actions = actions.concat(
        episodeDownloadsErrors
          .filter(m => m.error && m.error.status === 500)
          .map(m =>
            ACTIONS.CastleEpisodeDownloadsLoad({
              podcastId: m.podcastId,
              guid: m.guid,
              page: m.page,
              interval,
              beginDate,
              endDate
            })
          )
      );
    }
    return actions;
  }
);

export const selectDropday500ErrorReloadActions = createSelector(
  selectRouter,
  selectSelectedEpisodeDropdayErrors,
  (routerParams: RouterParams, dropdayErrors: EpisodeDropday[]) => {
    return dropdayErrors
      .filter(d => d.error && d.error.status === 500)
      .map(d =>
        ACTIONS.CastleEpisodeDropdayLoad({
          guid: d.guid,
          title: d.title,
          publishedAt: d.publishedAt,
          podcastId: routerParams.podcastId,
          interval: routerParams.interval,
          days: routerParams.days
        })
      );
  }
);

export const selectListeners500ErrorReloadActions = createSelector(
  selectRouter,
  selectPodcastListenersError,
  (routerParams: RouterParams, listenersErrors: PodcastListeners[]) => {
    return listenersErrors
      .filter(e => e.error && e.error.status === 500)
      .map(e =>
        ACTIONS.CastlePodcastListenersLoad({
          id: routerParams.podcastId,
          interval: routerParams.interval,
          beginDate: routerParams.beginDate,
          endDate: routerParams.endDate
        })
      );
  }
);

export const selectRankTotal500ErrorReloadActions = createSelector(
  selectRouter,
  selectAggregateSelectedEpisodeGuids,
  selectRoutedPodcastRanksError,
  selectRoutedPodcastTotalsError,
  selectSelectedEpisodesRanksErrors,
  selectSelectedEpisodesTotalsErrors,
  (
    routerParams: RouterParams,
    selectedGuids: string[],
    podcastRanksError: any,
    podcastTotalsError: any,
    episodesRanksErrors,
    episodesTotalsErrors
  ) => {
    let actions = [];
    const { podcastId, group, interval, beginDate, endDate } = routerParams;
    if (!selectedGuids || selectedGuids.length === 0) {
      if (podcastRanksError && podcastRanksError.status === 500) {
        actions.push(
          ACTIONS.CastlePodcastRanksLoad({
            podcastId,
            group,
            interval,
            beginDate,
            endDate
          })
        );
      }
      if (podcastTotalsError && podcastTotalsError.status === 500) {
        actions.push(
          ACTIONS.CastlePodcastTotalsLoad({
            podcastId,
            group,
            beginDate,
            endDate
          })
        );
      }
    } else {
      actions = actions.concat(
        episodesRanksErrors
          .filter(m => m.error && m.error.status === 500)
          .map(m =>
            ACTIONS.CastleEpisodeRanksLoad({
              guid: m.guid,
              group,
              interval,
              beginDate,
              endDate
            })
          )
      );
      actions = actions.concat(
        episodesTotalsErrors
          .filter(m => m.error && m.error.status === 500)
          .map(m =>
            ACTIONS.CastleEpisodeTotalsLoad({
              guid: m.guid,
              group,
              beginDate,
              endDate
            })
          )
      );
    }
    return actions;
  }
);

export const select500ErrorReloadActions = createSelector(
  selectRouter,
  selectPodcastError,
  selectEpisodeError,
  selectDownload500ErrorReloadActions,
  selectDropday500ErrorReloadActions,
  selectListeners500ErrorReloadActions,
  selectRankTotal500ErrorReloadActions,
  (
    routerParams: RouterParams,
    podcastError: any,
    episodeError: any,
    downloadErrorReloadActions: Action[],
    dropdayErrorReloadActions: Action[],
    listenersErrorReloadActions: Action[],
    rankTotalErrorReloadActions: Action[]
  ) => {
    const actions = [];
    if (podcastError && podcastError.status === 500) {
      actions.push(ACTIONS.CastlePodcastPageLoad({ page: 1, all: true }));
    }
    if (
      (routerParams.metricsType === METRICSTYPE_DOWNLOADS || routerParams.metricsType === METRICSTYPE_DROPDAY) &&
      episodeError &&
      episodeError.status === 500
    ) {
      actions.push(
        ACTIONS.CastleEpisodePageLoad({
          podcastId: routerParams.podcastId,
          page: 1,
          per: EPISODE_PAGE_SIZE
        })
      );
    }
    switch (routerParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        return actions.concat(downloadErrorReloadActions);
      case METRICSTYPE_DROPDAY:
        return actions.concat(dropdayErrorReloadActions);
      case METRICSTYPE_LISTENERS:
        return actions.concat(listenersErrorReloadActions);
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        return actions.concat(rankTotalErrorReloadActions);
    }
  }
);

export const selectNested500ErrorReloadActions = createSelector(
  selectRouter,
  selectAggregateSelectedEpisodeGuids,
  selectNestedPodcastRanksError,
  selectNestedPodcastTotalsError,
  selectNestedEpisodesRanksErrors,
  selectNestedEpisodesTotalsErrors,
  (
    routerParams: RouterParams,
    selectedGuids: string[],
    podcastRanksError: any,
    podcastTotalsError: any,
    episodesRanksErrors: any[],
    episodesTotalsErrors: any[]
  ) => {
    let actions = [];
    const { podcastId, filter, interval, beginDate, endDate } = routerParams;
    if (!selectedGuids || selectedGuids.length === 0) {
      if (podcastRanksError && podcastRanksError.status === 500) {
        actions.push(
          ACTIONS.CastlePodcastRanksLoad({
            podcastId,
            group: GROUPTYPE_GEOSUBDIV,
            filter,
            interval,
            beginDate,
            endDate
          })
        );
      }
      if (podcastTotalsError && podcastTotalsError.status === 500) {
        actions.push(
          ACTIONS.CastlePodcastTotalsLoad({
            podcastId,
            group: GROUPTYPE_GEOSUBDIV,
            filter,
            beginDate,
            endDate
          })
        );
      }
    } else {
      actions = actions.concat(
        episodesRanksErrors
          .filter(m => m.error && m.error.status === 500)
          .map(m =>
            ACTIONS.CastleEpisodeRanksLoad({
              guid: m.guid,
              group: GROUPTYPE_GEOSUBDIV,
              filter,
              interval,
              beginDate,
              endDate
            })
          )
      );
      actions = actions.concat(
        episodesTotalsErrors
          .filter(m => m.error && m.error.status === 500)
          .map(m =>
            ACTIONS.CastleEpisodeTotalsLoad({
              guid: m.guid,
              group: GROUPTYPE_GEOSUBDIV,
              beginDate,
              endDate
            })
          )
      );
    }
    return actions;
  }
);
