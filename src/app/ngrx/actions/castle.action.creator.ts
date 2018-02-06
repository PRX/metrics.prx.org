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

export class CastlePodcastAllTimeMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD;
}

export interface CastlePodcastAllTimeMetricsSuccessPayload {
  podcast: PodcastModel;
  allTimeDownloads: number;
}

export class CastlePodcastAllTimeMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_SUCCESS;

  constructor(public payload: CastlePodcastAllTimeMetricsSuccessPayload) {}
}

export class CastlePodcastAllTimeMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_FAILURE;

  constructor(public payload: any) {}
}

export interface CastleEpisodeAllTimeMetricsLoadPayload {
  episode: EpisodeModel;
}

export class CastleEpisodeAllTimeMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_LOAD;

  constructor(public payload: CastleEpisodeAllTimeMetricsLoadPayload) {}
}

export interface CastleEpisodeAllTimeMetricsSuccessPayload {
  episode: EpisodeModel;
  allTimeDownloads: number;
}

export class CastleEpisodeAllTimeMetricsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_SUCCESS;

  constructor(public payload: CastleEpisodeAllTimeMetricsSuccessPayload) {}
}

export class CastleEpisodeAllTimeMetricsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_FAILURE;

  constructor(public payload: any) {}
}
