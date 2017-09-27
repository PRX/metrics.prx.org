import { Action } from '@ngrx/store';
import { EpisodeModel, PodcastModel, FilterModel, MetricsType } from '../model';

export const ActionTypes = {
  CMS_PODCAST_FEED: 'CMS_PODCAST_FEED',
  CMS_EPISODE_GUID: 'CMS_EPISODE_GUID',
  CASTLE_PODCAST_METRICS: 'CASTLE_PODCAST_METRICS',
  CASTLE_EPISODE_METRICS: 'CASTLE_EPISODE_METRICS',
  CASTLE_FILTER: 'CASTLE_FILTER'
};

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

export interface CmsPodcastFeedPayload {
  podcast: PodcastModel;
}

export class CmsPodcastFeedAction implements ActionWithPayload<CmsPodcastFeedPayload> {
  readonly type = ActionTypes.CMS_PODCAST_FEED;

  constructor(public payload: CmsPodcastFeedPayload) {}
}

export interface CmsEpisodeGuidPayload {
  podcast: PodcastModel;
  episode: EpisodeModel;
}

export class CmsEpisodeGuidAction implements ActionWithPayload<CmsEpisodeGuidPayload> {
  readonly type = ActionTypes.CMS_EPISODE_GUID;

  constructor(public payload: CmsEpisodeGuidPayload) {}
}

export interface CastlePodcastMetricsPayload {
  podcast: PodcastModel;
  filter: FilterModel;
  metricsType: MetricsType;
  metrics: any[][];
}

export class CastlePodcastMetricsAction implements ActionWithPayload<CastlePodcastMetricsPayload> {
  readonly type = ActionTypes.CASTLE_PODCAST_METRICS;

  constructor(public payload: CastlePodcastMetricsPayload) {}
}

export interface CastleEpisodeMetricsPayload {
  episode: EpisodeModel;
  filter: FilterModel;
  metricsType: MetricsType;
  metrics: any[][];
}

export class CastleEpisodeMetricsAction implements ActionWithPayload<CastleEpisodeMetricsPayload> {
  readonly type = ActionTypes.CASTLE_EPISODE_METRICS;

  constructor(public payload: CastleEpisodeMetricsPayload) {}
}

export interface CastleFilterPayload {
  filter: FilterModel;
}

export class CastleFilterAction implements ActionWithPayload<CastleFilterPayload> {
  readonly type = ActionTypes.CASTLE_FILTER;

  constructor(public payload: CastleFilterPayload) {}
}

export type All
  = CmsPodcastFeedPayload
  | CmsEpisodeGuidPayload
  | CastlePodcastMetricsPayload
  | CastleEpisodeMetricsPayload
  | CastleFilterAction;
