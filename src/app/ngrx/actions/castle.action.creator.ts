import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { FilterModel, EpisodeModel, PodcastModel, MetricsType } from '../';

export interface CastleFilterPayload {
  filter: FilterModel;
}

export class CastleFilterAction implements Action {
  readonly type = ActionTypes.CASTLE_FILTER;

  constructor(public payload: CastleFilterPayload) {}
}

export interface CastlePodcastMetricsPayload {
  podcast: PodcastModel;
  filter: FilterModel;
  metricsType: MetricsType;
  metrics: any[][];
}

export class CastlePodcastMetricsAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS;

  constructor(public payload: CastlePodcastMetricsPayload) {}
}

export interface CastleEpisodeMetricsPayload {
  episode: EpisodeModel;
  filter: FilterModel;
  metricsType: MetricsType;
  metrics: any[][];
}

export class CastleEpisodeMetricsAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS;

  constructor(public payload: CastleEpisodeMetricsPayload) {}
}

export interface CastlePodcastChartTogglePayload {
  seriesId: number;
  charted: boolean;
}

export class CastlePodcastChartToggleAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_CHART_TOGGLE;

  constructor(public payload: CastlePodcastChartTogglePayload) {}
}

export interface CastleEpisodeChartTogglePayload {
  id: number;
  seriesId: number;
  charted: boolean;
}

export class CastleEpisodeChartToggleAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_CHART_TOGGLE;

  constructor(public payload: CastleEpisodeChartTogglePayload) {}
}

export interface CastlePodcastAllTimeMetricsLoadPayload {
  filter: FilterModel;
}

export class CastlePodcastAllTimeMetricsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD;

  constructor(public payload: CastlePodcastAllTimeMetricsLoadPayload) {}
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
