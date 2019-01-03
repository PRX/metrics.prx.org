import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { Podcast, Episode, MetricsType, IntervalModel, Rank } from '../';

export interface CastlePodcastPageLoadPayload {
  page: number;
  all?: boolean;
}

export class CastlePodcastPageLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_PAGE_LOAD;

  constructor(public payload: CastlePodcastPageLoadPayload) {}
}

export interface CastlePodcastPageSuccessPayload {
  podcasts: Podcast[];
  page: number;
  total: number;
  all?: boolean;
}

export class CastlePodcastPageSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS;

  constructor(public payload: CastlePodcastPageSuccessPayload) {}
}

export class CastlePodcastPageFailureAction {
  readonly type = ActionTypes.CASTLE_PODCAST_PAGE_FAILURE;

  constructor(public payload: {error: any}) {}
}

export interface CastleEpisodePageLoadPayload {
  podcastId: string;
  page: number;
  per: number;
}

export class CastleEpisodePageLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_LOAD;

  constructor(public payload: CastleEpisodePageLoadPayload) {}
}

export class CastleEpisodeSearchPageLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_SEARCH_PAGE_LOAD;

  constructor(public payload: CastleEpisodePageLoadPayload) {}
}

export interface CastleEpisodePageSuccessPayload {
  page: number;
  per: number;
  total: number;
  all?: boolean;
  episodes: Episode[];
}

export class CastleEpisodePageSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS;

  constructor(public payload: CastleEpisodePageSuccessPayload) {}
}

export class CastleEpisodeSearchPageSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_SEARCH_PAGE_SUCCESS;

  constructor(public payload: CastleEpisodePageSuccessPayload) {}
}

export class CastleEpisodePageFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_FAILURE;

  constructor(public payload: {error: any}) {}
}

export class CastleEpisodeSearchPageFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_SEARCH_PAGE_FAILURE;

  constructor(public payload: {error: any}) {}
}

export interface CastlePodcastMetricsLoadPayload {
  id: string;
  metricsType: MetricsType;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastlePodcastMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS_LOAD;

  constructor(public payload: CastlePodcastMetricsLoadPayload) {}
}

export interface CastlePodcastMetricsSuccessPayload {
  id: string;
  metricsPropertyName: string;
  metrics: any[][];
}

export class CastlePodcastMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS_SUCCESS;

  constructor(public payload: CastlePodcastMetricsSuccessPayload) {}
}

export interface CastlePodcastMetricsFailurePayload {
  id: string;
  error: any;
}

export class CastlePodcastMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS_FAILURE;

  constructor(public payload: CastlePodcastMetricsFailurePayload) {}
}

export interface CastleEpisodeMetricsLoadPayload {
  podcastId: string;
  page: number;
  guid: string;
  metricsType: MetricsType;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastleEpisodeMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS_LOAD;

  constructor(public payload: CastleEpisodeMetricsLoadPayload) {}
}

export interface CastleEpisodeMetricsSuccessPayload {
  podcastId: string;
  page: number;
  guid: string;
  metricsPropertyName: string;
  metrics: any[][];
}

export class CastleEpisodeMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS_SUCCESS;

  constructor(public payload: CastleEpisodeMetricsSuccessPayload) {}
}

export interface CastleEpisodeMetricsFailurePayload {
  podcastId: string;
  page: number;
  guid: string;
  error: any;
}

export class CastleEpisodeMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS_FAILURE;

  constructor(public payload: CastleEpisodeMetricsFailurePayload) {}
}

export interface CastlePodcastAllTimeDownloadsLoadPayload {
  id: string;
}

export class CastlePodcastAllTimeDownloadsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_LOAD;

  constructor(public payload: CastlePodcastAllTimeDownloadsLoadPayload) {}
}

export interface CastlePodcastAllTimeDownloadsSuccessPayload {
  id: string;
  total: number;
}

export class CastlePodcastAllTimeDownloadsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_SUCCESS;

  constructor(public payload: CastlePodcastAllTimeDownloadsSuccessPayload) {}
}

export interface CastlePodcastAllTimeDownloadsFailurePayload {
  id: string;
  error: any;
}

export class CastlePodcastAllTimeDownloadsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_FAILURE;

  constructor(public payload: CastlePodcastAllTimeDownloadsFailurePayload) {}
}

export interface CastleEpisodeAllTimeDownloadsLoadPayload {
  podcastId: string;
  guid: string;
}

export class CastleEpisodeAllTimeDownloadsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD;

  constructor(public payload: CastleEpisodeAllTimeDownloadsLoadPayload) {}
}

export interface CastleEpisodeAllTimeDownloadsSuccessPayload {
  podcastId: string;
  guid: string;
  total: number;
}

export class CastleEpisodeAllTimeDownloadsSuccessAction implements Action {
  readonly type = <string>ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_SUCCESS;

  constructor(public payload: CastleEpisodeAllTimeDownloadsSuccessPayload) {}
}

export interface CastleEpisodeAllTimeDownloadsFailurePayload {
  podcastId: string;
  guid: string;
  error: any;
}

export class CastleEpisodeAllTimeDownloadsFailureAction implements Action {
  readonly type = <string>ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_FAILURE;

  constructor(public payload: CastleEpisodeAllTimeDownloadsFailurePayload) {}
}

export interface CastlePodcastRanksLoadPayload {
  id: string;
  group: string;
  filter?: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastlePodcastRanksLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_RANKS_LOAD;

  constructor(public payload: CastlePodcastRanksLoadPayload) {}
}

export interface CastlePodcastRanksSuccessPayload {
  id: string;
  group: string;
  filter?: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
  downloads: any[][];
  ranks: Rank[];
}

export class CastlePodcastRanksSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS;

  constructor(public payload: CastlePodcastRanksSuccessPayload) {}
}

export interface CastlePodcastRanksFailurePayload {
  id: string;
  group: string;
  filter?: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
  error: any;
}

export class CastlePodcastRanksFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_RANKS_FAILURE;

  constructor(public payload: CastlePodcastRanksFailurePayload) {}
}

export interface CastlePodcastTotalsLoadPayload {
  id: string;
  group: string;
  filter?: string;
  beginDate: Date;
  endDate: Date;
}

export class CastlePodcastTotalsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_LOAD;

  constructor(public payload: CastlePodcastTotalsLoadPayload) {}
}

export interface CastlePodcastTotalsSuccessPayload {
  id: string;
  group: string;
  filter?: string;
  beginDate: Date;
  endDate: Date;
  ranks: Rank[];
}

export class CastlePodcastTotalsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS;

  constructor(public payload: CastlePodcastTotalsSuccessPayload) {}
}

export interface CastlePodcastTotalsFailurePayload {
  id: string;
  group: string;
  filter?: string;
  beginDate: Date;
  endDate: Date;
  error: any;
}

export class CastlePodcastTotalsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE;

  constructor(public payload: CastlePodcastTotalsFailurePayload) {}
}
