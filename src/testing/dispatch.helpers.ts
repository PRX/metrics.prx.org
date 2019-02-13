import { Store } from '@ngrx/store';
import * as fixtures from './downloads.fixtures';
import { RouterParams, Podcast, Episode, EPISODE_PAGE_SIZE, GROUPTYPE_GEOCOUNTRY, GroupType, GROUPTYPE_AGENTNAME } from '../app/ngrx';
import * as ACTIONS from '../app/ngrx/actions';


export const dispatchRouterNavigation = (store: Store<any>, routerParams?: RouterParams) => {
  store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {
    ...fixtures.routerParams,
    ...(routerParams && routerParams.podcastId && {podcastId: routerParams.podcastId}),
    ...(routerParams && routerParams.metricsType && {metricsType: routerParams.metricsType}),
    ...(routerParams && routerParams.group && {group: routerParams.group}),
    ...(routerParams && routerParams.filter && {filter: routerParams.filter}),
    ...(routerParams && routerParams.chartType && {chartType: routerParams.chartType}),
    ...(routerParams && routerParams.interval && {interval: routerParams.interval}),
    ...(routerParams && routerParams.episodePage && {episodePage: routerParams.episodePage}),
    ...(routerParams && routerParams.standardRange && {standardRange: routerParams.standardRange}),
    ...(routerParams && routerParams.beginDate && {beginDate: routerParams.beginDate}),
    ...(routerParams && routerParams.endDate && {endDate: routerParams.endDate})
  }}));
};

export const dispatchPodcasts = (store: Store<any>, podcast?: Podcast) => {
  store.dispatch(new ACTIONS.CastlePodcastPageSuccessAction(
    {podcasts: [podcast || fixtures.podcast], page: 1, total: 1}));
};

export const dispatchEpisodePage = (store: Store<any>, episodes?: Episode[], page?: number) => {
  store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
    episodes: episodes || fixtures.episodes,
    page: page || 1,
    per: EPISODE_PAGE_SIZE,
    total: episodes && episodes.length || fixtures.episodes.length
  }));
};

export const dispatchEpisodeSelectList = (store: Store<any>, episodes?: Episode[]) => {
  store.dispatch(new ACTIONS.CastleEpisodeSelectPageSuccessAction({
    episodes: episodes || fixtures.episodes,
    page: 1,
    per: EPISODE_PAGE_SIZE,
    total: episodes && episodes.length || fixtures.episodes.length
  }));
};

export const dispatchSelectEpisodes = (store: Store<any>, episodesGuids?: string[]) => {
  store.dispatch(new ACTIONS.EpisodeSelectEpisodesAction({
    episodeGuids: episodesGuids || [fixtures.episodes[0].guid]
  }));
};

export const dispatchPodcastDownloads = (store: Store<any>, podcastId?: string, downloads?: any[][]) => {
  store.dispatch(new ACTIONS.CastlePodcastDownloadsSuccessAction({
    id: podcastId || fixtures.podcast.id,
    downloads: downloads || fixtures.podDownloads
  }));
};

export const dispatchEpisodeDownloads = (store: Store<any>, podcastId?: string, page?: number, guid?: string, downloads?: any[][]) => {
  store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
    podcastId: podcastId || fixtures.episodes[0].podcastId,
    page: page || fixtures.episodes[0].page,
    guid: guid || fixtures.episodes[0].guid,
    downloads: downloads || fixtures.ep0Downloads
  }));
  store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
    podcastId: podcastId || fixtures.episodes[1].podcastId,
    page: page || fixtures.episodes[1].page,
    guid: guid || fixtures.episodes[1].guid,
    downloads: downloads || fixtures.ep1Downloads
  }));
};

export const dispatchPodcastRanks = (store: Store<any>, routerParams?: RouterParams, ranks?: any[], downloads?: any[][]) => {
  store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
    id: routerParams && routerParams.podcastId || fixtures.podcast.id,
    group: routerParams && routerParams.group || GROUPTYPE_GEOCOUNTRY,
    ...(routerParams && routerParams.filter && {filter: routerParams.filter}),
    interval: routerParams && routerParams.interval || fixtures.routerParams.interval,
    beginDate: routerParams && routerParams.beginDate || fixtures.routerParams.beginDate,
    endDate: routerParams && routerParams.endDate || fixtures.routerParams.endDate,
    ranks: ranks || fixtures.podcastGeoCountryRanks,
    downloads: downloads || fixtures.podcastGeoCountryDownloads
  }));
};

export const dispatchPodcastTotals = (store: Store<any>, routerParams?: RouterParams, ranks?: any[]) => {
  store.dispatch(new ACTIONS.CastlePodcastTotalsSuccessAction({
    id: routerParams && routerParams.podcastId || fixtures.podcast.id,
    group: routerParams && routerParams.group || GROUPTYPE_GEOCOUNTRY,
    ...(routerParams && routerParams.filter && {filter: routerParams.filter}),
    beginDate: routerParams && routerParams.beginDate || fixtures.routerParams.beginDate,
    endDate: routerParams && routerParams.endDate || fixtures.routerParams.endDate,
    ranks: ranks || fixtures.podcastGeoCountryRanks
  }));
};

export const dispatchEpisodeRanks = (store: Store<any>, routerParams?: RouterParams, guid?: string, ranks?: any[], downloads?: any[][]) => {
  store.dispatch(new ACTIONS.CastleEpisodeRanksSuccessAction({
    guid: guid || fixtures.episodes[0].guid,
    group: routerParams && routerParams.group || GROUPTYPE_GEOCOUNTRY,
    ...(routerParams && routerParams.filter && {filter: routerParams.filter}),
    interval: routerParams && routerParams.interval || fixtures.routerParams.interval,
    beginDate: routerParams && routerParams.beginDate || fixtures.routerParams.beginDate,
    endDate: routerParams && routerParams.endDate || fixtures.routerParams.endDate,
    ranks: ranks || fixtures.ep0AgentNameRanks,
    downloads: downloads || fixtures.ep0AgentNameDownloads
  }));
};

export const dispatchEpisodeTotals = (store: Store<any>, routerParams?: RouterParams, guid?: string, ranks?: any[]) => {
  store.dispatch(new ACTIONS.CastleEpisodeTotalsSuccessAction({
    guid: guid || fixtures.episodes[0].guid,
    group: routerParams && routerParams.group || GROUPTYPE_GEOCOUNTRY,
    ...(routerParams && routerParams.filter && {filter: routerParams.filter}),
    beginDate: routerParams && routerParams.beginDate || fixtures.routerParams.beginDate,
    endDate: routerParams && routerParams.endDate || fixtures.routerParams.endDate,
    ranks: ranks || fixtures.ep0AgentNameRanks
  }));
};

export const dispatchPodcastDownloadsChartToggle = (store: Store<any>, podcastId?: string, charted?: boolean) => {
  store.dispatch(new ACTIONS.ChartTogglePodcastAction({
    id: podcastId || fixtures.podcast.id,
    charted: charted || false
  }));
};

export const dispatchEpisodeDownloadsChartToggle = (store: Store<any>, guid?: string, charted?: boolean) => {
  store.dispatch(new ACTIONS.ChartToggleEpisodeAction({
    guid: guid || fixtures.episodes[0].guid,
    charted: charted || false
  }));
};

export const dispatchGroupChartToggle = (store: Store<any>, group?: GroupType, groupName?: string, charted?: boolean) => {
  store.dispatch(new ACTIONS.ChartToggleGroupAction({
    group: group || GROUPTYPE_AGENTNAME,
    groupName: groupName || 'Unknown',
    charted: charted || false
  }));
};