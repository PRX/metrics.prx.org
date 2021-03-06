import { Store } from '@ngrx/store';
import * as fixtures from './downloads.fixtures';
import {
  RouterParams,
  Podcast,
  Episode,
  EPISODE_PAGE_SIZE,
  GroupType,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_AGENTNAME,
  IntervalModel,
  MetricsType
} from '@app/ngrx';
import * as ACTIONS from '@app/ngrx/actions';

export const dispatchRouterNavigation = (store: Store<any>, routerParams?: RouterParams) => {
  const { podcastId, metricsType, group, filter, chartType, interval, episodePage, standardRange, beginDate, endDate } =
    routerParams || fixtures.routerParams;
  store.dispatch(
    ACTIONS.CustomRouterNavigation({
      routerParams: {
        ...fixtures.routerParams,
        ...(podcastId && { podcastId }),
        ...(metricsType && { metricsType }),
        ...(group && { group }),
        ...(filter && { filter }),
        ...(chartType && { chartType }),
        ...(interval && { interval }),
        ...(episodePage && { episodePage }),
        ...(standardRange && { standardRange }),
        ...(beginDate && { beginDate }),
        ...(endDate && { endDate })
      }
    })
  );
};

export const dispatchPodcasts = (store: Store<any>, podcast?: Podcast) => {
  store.dispatch(ACTIONS.CastlePodcastPageSuccess({ podcasts: [podcast || fixtures.podcast], page: 1, total: 1 }));
};

export const dispatchEpisodePage = (store: Store<any>, episodes?: Episode[], page?: number) => {
  store.dispatch(
    ACTIONS.CastleEpisodePageSuccess({
      episodes: episodes || fixtures.episodes,
      page: page || 1,
      per: EPISODE_PAGE_SIZE,
      total: (episodes && episodes.length) || fixtures.episodes.length
    })
  );
};

export const dispatchEpisodeSelectList = (store: Store<any>, episodes?: Episode[]) => {
  store.dispatch(
    ACTIONS.CastleEpisodeSelectPageSuccess({
      episodes: episodes || fixtures.episodes,
      page: 1,
      per: EPISODE_PAGE_SIZE,
      total: (episodes && episodes.length) || fixtures.episodes.length
    })
  );
};

export const dispatchSelectEpisodes = (store: Store<any>, podcastId?: string, metricsType?: MetricsType, episodesGuids?: string[]) => {
  store.dispatch(
    ACTIONS.EpisodeSelectEpisodes({
      podcastId: podcastId || fixtures.routerParams.podcastId,
      metricsType: metricsType || fixtures.routerParams.metricsType,
      episodeGuids: episodesGuids || [fixtures.episodes[0].guid]
    })
  );
};

export const dispatchPodcastDownloads = (store: Store<any>, podcastId?: string, downloads?: any[][]) => {
  store.dispatch(
    ACTIONS.CastlePodcastDownloadsSuccess({
      id: podcastId || fixtures.podcast.id,
      downloads: downloads || fixtures.podDownloads
    })
  );
};

export const dispatchEpisodeDownloads = (store: Store<any>, podcastId?: string, page?: number, guid?: string, downloads?: any[][]) => {
  store.dispatch(
    ACTIONS.CastleEpisodeDownloadsSuccess({
      podcastId: podcastId || fixtures.episodes[0].podcastId,
      page: page || fixtures.episodes[0].page,
      guid: guid || fixtures.episodes[0].guid,
      downloads: downloads || fixtures.ep0Downloads
    })
  );
  store.dispatch(
    ACTIONS.CastleEpisodeDownloadsSuccess({
      podcastId: podcastId || fixtures.episodes[1].podcastId,
      page: page || fixtures.episodes[1].page,
      guid: guid || fixtures.episodes[1].guid,
      downloads: downloads || fixtures.ep1Downloads
    })
  );
};

export const dispatchEpisodeAllTimeDownloads = (store: Store<any>, podcastId?: string) => {
  store.dispatch(
    ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
      podcastId: podcastId || fixtures.episodes[0].podcastId,
      guid: fixtures.episodes[0].guid,
      ...fixtures.ep0AllTimeDownloads
    })
  );
  store.dispatch(
    ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
      podcastId: fixtures.episodes[1].podcastId,
      guid: fixtures.episodes[1].guid,
      ...fixtures.ep1AllTimeDownloads
    })
  );
};

export const dispatchLoadEpisodeDropday = (store: Store<any>, podcastId?: string, interval?: IntervalModel, days?: number) => {
  store.dispatch(
    ACTIONS.CastleEpisodeDropdayLoad({
      podcastId: podcastId || fixtures.episodes[0].podcastId,
      guid: fixtures.episodes[0].guid,
      title: fixtures.episodes[0].title,
      publishedAt: fixtures.episodes[0].publishedAt,
      interval: interval || fixtures.routerParams.interval,
      days: days || 28
    })
  );
  store.dispatch(
    ACTIONS.CastleEpisodeDropdayLoad({
      podcastId: podcastId || fixtures.episodes[1].podcastId,
      guid: fixtures.episodes[1].guid,
      title: fixtures.episodes[1].title,
      publishedAt: fixtures.episodes[1].publishedAt,
      interval: interval || fixtures.routerParams.interval,
      days: days || 28
    })
  );
};

export const dispatchEpisodeDropday = (store: Store<any>, podcastId?: string, interval?: IntervalModel) => {
  store.dispatch(
    ACTIONS.CastleEpisodeDropdaySuccess({
      podcastId: podcastId || fixtures.episodes[0].podcastId,
      guid: fixtures.episodes[0].guid,
      title: fixtures.episodes[0].title,
      publishedAt: fixtures.episodes[0].publishedAt,
      interval: interval || fixtures.routerParams.interval,
      downloads: fixtures.ep0Downloads
    })
  );
  store.dispatch(
    ACTIONS.CastleEpisodeDropdaySuccess({
      podcastId: podcastId || fixtures.episodes[1].podcastId,
      guid: fixtures.episodes[1].guid,
      title: fixtures.episodes[1].title,
      publishedAt: fixtures.episodes[1].publishedAt,
      interval: interval || fixtures.routerParams.interval,
      downloads: fixtures.ep1Downloads
    })
  );
};

export const dispatchLoadPodcastListeners = (store: Store<any>) => {
  store.dispatch(
    ACTIONS.CastlePodcastListenersLoad({
      id: fixtures.routerParams.podcastId,
      interval: fixtures.routerParams.interval,
      beginDate: fixtures.routerParams.beginDate,
      endDate: fixtures.routerParams.endDate
    })
  );
};

export const dispatchPodcastListeners = (store: Store<any>, podcastId?: string, listeners?: any[][]) => {
  store.dispatch(
    ACTIONS.CastlePodcastListenersSuccess({
      id: podcastId || fixtures.podcast.id,
      listeners: listeners || fixtures.podDownloads
    })
  );
};

export const dispatchPodcastRanks = (store: Store<any>, routerParams?: RouterParams, ranks?: any[], downloads?: any[][]) => {
  const { podcastId, group, filter, interval, beginDate, endDate } = routerParams || fixtures.routerParams;
  store.dispatch(
    ACTIONS.CastlePodcastRanksSuccess({
      podcastId: podcastId || fixtures.podcast.id,
      group: group || GROUPTYPE_GEOCOUNTRY,
      ...(filter && { filter }),
      interval: interval || fixtures.routerParams.interval,
      beginDate: beginDate || fixtures.routerParams.beginDate,
      endDate: endDate || fixtures.routerParams.endDate,
      ranks: ranks || fixtures.podcastGeoCountryRanks,
      downloads: downloads || fixtures.podcastGeoCountryDownloads
    })
  );
};

export const dispatchPodcastTotals = (store: Store<any>, routerParams?: RouterParams, ranks?: any[]) => {
  const { podcastId, group, filter, beginDate, endDate } = routerParams || fixtures.routerParams;
  store.dispatch(
    ACTIONS.CastlePodcastTotalsSuccess({
      podcastId: podcastId || fixtures.podcast.id,
      group: group || GROUPTYPE_GEOCOUNTRY,
      ...(filter && { filter }),
      beginDate: beginDate || fixtures.routerParams.beginDate,
      endDate: endDate || fixtures.routerParams.endDate,
      ranks: ranks || fixtures.podcastGeoCountryRanks
    })
  );
};

export const dispatchEpisodeRanks = (store: Store<any>, routerParams?: RouterParams, guid?: string, ranks?: any[], downloads?: any[][]) => {
  const { group, filter, interval, beginDate, endDate } = routerParams || fixtures.routerParams;
  store.dispatch(
    ACTIONS.CastleEpisodeRanksSuccess({
      guid: guid || fixtures.episodes[0].guid,
      group: group || GROUPTYPE_GEOCOUNTRY,
      ...(filter && { filter }),
      interval: interval || fixtures.routerParams.interval,
      beginDate: beginDate || fixtures.routerParams.beginDate,
      endDate: endDate || fixtures.routerParams.endDate,
      ranks: ranks || fixtures.ep0AgentNameRanks,
      downloads: downloads || fixtures.ep0AgentNameDownloads
    })
  );
};

export const dispatchEpisodeTotals = (store: Store<any>, routerParams?: RouterParams, guid?: string, ranks?: any[]) => {
  const { group, filter, beginDate, endDate } = routerParams || fixtures.routerParams;
  store.dispatch(
    ACTIONS.CastleEpisodeTotalsSuccess({
      guid: guid || fixtures.episodes[0].guid,
      group: group || GROUPTYPE_GEOCOUNTRY,
      ...(filter && { filter }),
      beginDate: beginDate || fixtures.routerParams.beginDate,
      endDate: endDate || fixtures.routerParams.endDate,
      ranks: ranks || fixtures.ep0AgentNameRanks
    })
  );
};

export const dispatchPodcastDownloadsChartToggle = (store: Store<any>, podcastId?: string, charted?: boolean) => {
  store.dispatch(
    ACTIONS.ChartTogglePodcast({
      id: podcastId || fixtures.podcast.id,
      charted: charted || false
    })
  );
};

export const dispatchEpisodeDownloadsChartToggle = (store: Store<any>, podcastId?: string, guid?: string, charted?: boolean) => {
  store.dispatch(
    ACTIONS.ChartToggleEpisode({
      podcastId: podcastId || fixtures.episodes[0].guid,
      guid: guid || fixtures.episodes[0].guid,
      charted: charted || false
    })
  );
};

export const dispatchGroupChartToggle = (store: Store<any>, group?: GroupType, groupName?: string, charted?: boolean) => {
  store.dispatch(
    ACTIONS.ChartToggleGroup({
      group: group || GROUPTYPE_AGENTNAME,
      groupName: groupName || 'Unknown',
      charted: charted || false
    })
  );
};
