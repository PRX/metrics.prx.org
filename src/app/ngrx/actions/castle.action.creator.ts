import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { EpisodeModel, PodcastModel, MetricsType, IntervalModel } from '../';

export interface CastlePodcastMetricsLoadPayload {
  seriesId: number;
  feederId: string;
  metricsType: MetricsType;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastlePodcastMetricsLoadAction {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS_LOAD;

  constructor(public payload: CastlePodcastMetricsLoadPayload) {}
}

export interface CastlePodcastMetricsSuccessPayload {
  seriesId: number;
  feederId: string;
  metricsPropertyName: string;
  metrics: any[][];
}

export class CastlePodcastMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS_SUCCESS;

  constructor(public payload: CastlePodcastMetricsSuccessPayload) {}
}

export interface CastlePodcastMetricsFailurePayload {
  seriesId: number;
  feederId: string;
  error: any;
}

export class CastlePodcastMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS_FAILURE;

  constructor(public payload: CastlePodcastMetricsFailurePayload) {}
}

export interface CastleEpisodeMetricsLoadPayload {
  seriesId: number;
  page: number;
  id: number;
  guid: string;
  metricsType: MetricsType;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastleEpisodeMetricsLoadAction {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS_LOAD;

  constructor(public payload: CastleEpisodeMetricsLoadPayload) {}
}

export interface CastleEpisodeMetricsSuccessPayload {
  seriesId: number;
  page: number;
  id: number;
  guid: string;
  metricsPropertyName: string;
  metrics: any[][];
}

export class CastleEpisodeMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS_SUCCESS;

  constructor(public payload: CastleEpisodeMetricsSuccessPayload) {}
}

export interface CastleEpisodeMetricsFailurePayload {
  seriesId: number;
  page: number;
  id: number;
  guid: string;
  error: any;
}

export class CastleEpisodeMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS_FAILURE;

  constructor(public payload: CastleEpisodeMetricsFailurePayload) {}
}

export interface CastlePodcastPerformanceMetricsLoadPayload {
  seriesId: number;
  feederId: string;
}

export class CastlePodcastPerformanceMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_LOAD;

  constructor(public payload: CastlePodcastPerformanceMetricsLoadPayload) {}
}

export interface CastlePodcastPerformanceMetricsSuccessPayload {
  seriesId: number;
  feederId: string;
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
  seriesId: number;
  id: number;
  guid: string;
}

export class CastleEpisodePerformanceMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_LOAD;

  constructor(public payload: CastleEpisodePerformanceMetricsLoadPayload) {}
}

export interface CastleEpisodePerformanceMetricsSuccessPayload {
  seriesId: number;
  id: number;
  guid: string;
  total: number;
  previous7days: number;
  this7days: number;
  yesterday: number;
  today: number;
}

export class CastleEpisodePerformanceMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_SUCCESS;

  constructor(public payload: CastleEpisodePerformanceMetricsSuccessPayload) {}
}

export class CastleEpisodePerformanceMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_FAILURE;

  constructor(public payload: any) {}
}
