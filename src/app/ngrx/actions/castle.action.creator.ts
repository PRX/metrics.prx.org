import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { FilterModel, EpisodeModel, PodcastModel, MetricsType } from '../model';

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
