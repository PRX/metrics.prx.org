import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { IntervalModel } from '../';

export interface CastlePodcastDownloadsLoadPayload {
  id: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastlePodcastDownloadsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_DOWNLOADS_LOAD;

  constructor(public payload: CastlePodcastDownloadsLoadPayload) {}
}

export interface CastlePodcastDownloadsSuccessPayload {
  id: string;
  downloads: any[][];
}

export class CastlePodcastDownloadsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_DOWNLOADS_SUCCESS;

  constructor(public payload: CastlePodcastDownloadsSuccessPayload) {}
}

export interface CastlePodcastDownloadsFailurePayload {
  id: string;
  error: any;
}

export class CastlePodcastDownloadsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_PODCAST_DOWNLOADS_FAILURE;

  constructor(public payload: CastlePodcastDownloadsFailurePayload) {}
}

export interface CastleEpisodeDownloadsLoadPayload {
  podcastId: string;
  page: number;
  guid: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastleEpisodeDownloadsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_DOWNLOADS_LOAD;

  constructor(public payload: CastleEpisodeDownloadsLoadPayload) {}
}

export interface CastleEpisodeDownloadsSuccessPayload {
  podcastId: string;
  page: number;
  guid: string;
  downloads: any[][];
}

export class CastleEpisodeDownloadsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_DOWNLOADS_SUCCESS;

  constructor(public payload: CastleEpisodeDownloadsSuccessPayload) {}
}

export interface CastleEpisodeDownloadsFailurePayload {
  podcastId: string;
  page: number;
  guid: string;
  error: any;
}

export class CastleEpisodeDownloadsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_DOWNLOADS_FAILURE;

  constructor(public payload: CastleEpisodeDownloadsFailurePayload) {}
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

export interface CastleEpisodeDropdayLoadPayload {
  podcastId: string;
  guid: string;
  title: string;
  interval: IntervalModel;
  publishedAt: Date;
  days: number;
}

export class CastleEpisodeDropdayLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_DROPDAY_LOAD;

  constructor(public payload: CastleEpisodeDropdayLoadPayload) {}
}

export interface CastleEpisodeDropdaySuccessPayload {
  podcastId: string;
  guid: string;
  title: string;
  interval: IntervalModel;
  publishedAt: Date;
  downloads: any[][];
}

export class CastleEpisodeDropdaySuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_DROPDAY_SUCCESS;

  constructor(public payload: CastleEpisodeDropdaySuccessPayload) {}
}

export interface CastleEpisodeDropdayFailurePayload {
  podcastId: string;
  guid: string;
  title: string;
  interval: IntervalModel;
  publishedAt: Date;
  error: any;
}

export class CastleEpisodeDropdayFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_DROPDAY_FAILURE;

  constructor(public payload: CastleEpisodeDropdayFailurePayload) {}
}
