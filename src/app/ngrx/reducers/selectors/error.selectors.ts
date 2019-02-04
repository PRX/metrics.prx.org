import { createSelector } from '@ngrx/store';
import { selectRouter } from './router.selectors';
import { selectEpisodeError } from './episode.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeDownloadsError } from './episode-downloads.selectors';
import { selectPodcastDownloadsError } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksError, selectNestedPodcastRanksError } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsError, selectNestedPodcastTotalsError } from './podcast-totals.selectors';
import { selectSelectedEpisodeGuids } from './episode-select.selectors';
import { selectSelectedEpisodesRanksErrors, selectNestedEpisodesRanksErrors } from './episode-ranks.selectors';
import { selectSelectedEpisodesTotalsErrors, selectNestedEpisodesTotalsErrors } from './episode-totals.selectors';
import * as ACTIONS from '../../actions';
import { RouterParams, EpisodeDownloads, PodcastDownloads, METRICSTYPE_DOWNLOADS, GROUPTYPE_GEOSUBDIV, EPISODE_PAGE_SIZE } from '../models';

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
      actions = actions.concat(podcastDownloadsErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastlePodcastDownloadsLoadAction({
          id: m.id,
          interval,
          beginDate,
          endDate
        })));
    }
    if (episodeDownloadsErrors && episodeDownloadsErrors.length) {
      actions = actions.concat(episodeDownloadsErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastleEpisodeDownloadsLoadAction({
          podcastId: m.podcastId,
          guid: m.guid,
          page: m.page,
          interval,
          beginDate,
          endDate
        })));
    }
    return actions;
  });

export const selectRankTotal500ErrorReloadActions = createSelector(
  selectRouter,
  selectSelectedEpisodeGuids,
  selectRoutedPodcastRanksError,
  selectRoutedPodcastTotalsError,
  selectSelectedEpisodesRanksErrors,
  selectSelectedEpisodesTotalsErrors,
  (routerParams: RouterParams,
    selectedGuids: string[],
    podcastRanksError: any,
    podcastTotalsError: any,
    episodesRanksErrors,
    episodesTotalsErrors) => {
    let actions = [];
    const { podcastId, group, interval, beginDate, endDate } = routerParams;
    if (!selectedGuids || selectedGuids.length === 0) {
      if (podcastRanksError && podcastRanksError.status === 500) {
        actions.push(new ACTIONS.CastlePodcastRanksLoadAction({
          id: podcastId,
          group,
          interval,
          beginDate,
          endDate
        }));
      }
      if (podcastTotalsError && podcastTotalsError.status === 500) {
        actions.push(new ACTIONS.CastlePodcastTotalsLoadAction({
          id: podcastId,
          group,
          beginDate,
          endDate
        }));
      }
    } else {
      actions = actions.concat(episodesRanksErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastleEpisodeRanksLoadAction({
          guid: m.guid,
          group,
          interval,
          beginDate,
          endDate
        })));
      actions = actions.concat(episodesTotalsErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastleEpisodeTotalsLoadAction({
          guid: m.guid,
          group,
          beginDate,
          endDate
        })));
    }
    return actions;
  });

export const select500ErrorReloadActions =
  createSelector(selectRouter,
    selectPodcastError,
    selectEpisodeError,
    selectDownload500ErrorReloadActions,
    selectRankTotal500ErrorReloadActions,
  (routerParams: RouterParams,
    podcastError: any,
    episodeError: any,
    downloadErrorReloadActions: ACTIONS.AllActions[],
    rankTotalErrorReloadActions: ACTIONS.AllActions[]) => {
    let actions = [];
    if (podcastError && podcastError.status === 500) {
      actions.push(new ACTIONS.CastlePodcastPageLoadAction({page: 1, all: true}));
    }
    if (routerParams.metricsType === METRICSTYPE_DOWNLOADS) {
      if (episodeError && episodeError.status === 500) {
        actions.push(new ACTIONS.CastleEpisodePageLoadAction({
          podcastId: routerParams.podcastId, page: 1, per: EPISODE_PAGE_SIZE}));
      }
      actions = actions.concat(downloadErrorReloadActions);
    } else {
      actions = actions.concat(rankTotalErrorReloadActions);
    }
    return actions;
  });

export const selectNested500ErrorReloadActions = createSelector(
  selectRouter,
  selectSelectedEpisodeGuids,
  selectNestedPodcastRanksError,
  selectNestedPodcastTotalsError,
  selectNestedEpisodesRanksErrors,
  selectNestedEpisodesTotalsErrors,
  (routerParams: RouterParams,
    selectedGuids: string[],
    podcastRanksError: any,
    podcastTotalsError: any,
    episodesRanksErrors: any[],
    episodesTotalsErrors: any[]) => {
    let actions = [];
    const { podcastId, filter, interval, beginDate, endDate } = routerParams;
    if (!selectedGuids || selectedGuids.length === 0) {
      if (podcastRanksError && podcastRanksError.status === 500) {
        actions.push(new ACTIONS.CastlePodcastRanksLoadAction({
          id: podcastId,
          group: GROUPTYPE_GEOSUBDIV,
          filter,
          interval,
          beginDate,
          endDate
        }));
      }
      if (podcastTotalsError && podcastTotalsError.status === 500) {
        actions.push(new ACTIONS.CastlePodcastTotalsLoadAction({
          id: podcastId,
          group: GROUPTYPE_GEOSUBDIV,
          filter,
          beginDate,
          endDate
        }));
      }
    } else {
      actions = actions.concat(episodesRanksErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastleEpisodeRanksLoadAction({
          guid: m.guid,
          group: GROUPTYPE_GEOSUBDIV,
          filter,
          interval,
          beginDate,
          endDate
        })));
      actions = actions.concat(episodesTotalsErrors
        .filter(m => m.error && m.error.status === 500)
        .map(m => new ACTIONS.CastleEpisodeTotalsLoadAction({
          guid: m.guid,
          group: GROUPTYPE_GEOSUBDIV,
          beginDate,
          endDate
        })));
    }
    return actions;
  });
