import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { Podcast, Episode, MetricsType, IntervalModel, Totals } from '../';

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
  all?: boolean;
}

export class CastleEpisodePageLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_LOAD;

  constructor(public payload: CastleEpisodePageLoadPayload) {}
}

export interface CastleEpisodePageSuccessPayload {
  page: number;
  total: number;
  all?: boolean;
  episodes: Episode[];
}

export class CastleEpisodePageSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS;

  constructor(public payload: CastleEpisodePageSuccessPayload) {}
}

export class CastleEpisodePageFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_FAILURE;

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

export interface CastlePodcastPerformanceMetricsLoadPayload {
  id: string;
}

export class CastlePodcastPerformanceMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_LOAD;

  constructor(public payload: CastlePodcastPerformanceMetricsLoadPayload) {}
}

export interface CastlePodcastPerformanceMetricsSuccessPayload {
  id: string;
  total: number;
  previous7days: number;
  this7days: number;
  yesterday: number;
  today: number;
}

export class CastlePodcastPerformanceMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_SUCCESS;

  constructor(public payload: CastlePodcastPerformanceMetricsSuccessPayload) {}
}

export class CastlePodcastPerformanceMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_FAILURE;

  constructor(public payload: any) {}
}

export interface CastleEpisodePerformanceMetricsLoadPayload {
  podcastId: string;
  guid: string;
}

export class CastleEpisodePerformanceMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_LOAD;

  constructor(public payload: CastleEpisodePerformanceMetricsLoadPayload) {}
}

export interface CastleEpisodePerformanceMetricsSuccessPayload {
  podcastId: string;
  guid: string;
  total: number;
  previous7days: number;
  this7days: number;
  yesterday: number;
  today: number;
}

export class CastleEpisodePerformanceMetricsSuccessAction implements Action {
  readonly type = <string>ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_SUCCESS;

  constructor(public payload: CastleEpisodePerformanceMetricsSuccessPayload) {}
}

export class CastleEpisodePerformanceMetricsFailureAction implements Action {
  readonly type = <string>ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_FAILURE;

  constructor(public payload: any) {}
}

export interface CastlePodcastTotalsLoadPayload {
  id: string;
  group: string;
  interval: IntervalModel;
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
  interval: IntervalModel;
  downloads: any[][];
  ranks: Totals[][];
}

export class CastlePodcastTotalsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS;

  constructor(public payload: CastlePodcastTotalsSuccessPayload) {}
}

export interface CastlePodcastTotalsFailurePayload {
  id: string;
  group: string;
  error: any;
}

export class CastlePodcastTotalsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE;

  constructor(public payload: CastlePodcastTotalsFailurePayload) {}
}
