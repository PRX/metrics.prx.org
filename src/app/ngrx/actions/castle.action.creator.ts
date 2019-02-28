import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { Podcast, Episode, IntervalModel, Rank } from '../';

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
  search?: string;
}

export class CastleEpisodePageLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_LOAD;

  constructor(public payload: CastleEpisodePageLoadPayload) {}
}

export class CastleEpisodeSelectPageLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_SELECT_PAGE_LOAD;

  constructor(public payload: CastleEpisodePageLoadPayload) {}
}

export interface CastleEpisodePageSuccessPayload {
  page: number;
  per: number;
  total: number;
  search?: string;
  episodes: Episode[];
}

export class CastleEpisodePageSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS;

  constructor(public payload: CastleEpisodePageSuccessPayload) {}
}

export class CastleEpisodeSelectPageSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_SELECT_PAGE_SUCCESS;

  constructor(public payload: CastleEpisodePageSuccessPayload) {}
}

export class CastleEpisodePageFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_PAGE_FAILURE;

  constructor(public payload: {error: any}) {}
}

export class CastleEpisodeSelectPageFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_SELECT_PAGE_FAILURE;

  constructor(public payload: {error: any}) {}
}

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

export interface CastlePodcastRanksLoadPayload {
  podcastId: string;
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
  podcastId: string;
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
  podcastId: string;
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
  podcastId: string;
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
  podcastId: string;
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
  podcastId: string;
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

export interface CastleEpisodeRanksLoadPayload {
  guid: string;
  group: string;
  filter?: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class CastleEpisodeRanksLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_RANKS_LOAD;

  constructor(public payload: CastleEpisodeRanksLoadPayload) {}
}

export interface CastleEpisodeRanksSuccessPayload {
  guid: string;
  group: string;
  filter?: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
  downloads: any[][];
  ranks: Rank[];
}

export class CastleEpisodeRanksSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_RANKS_SUCCESS;

  constructor(public payload: CastleEpisodeRanksSuccessPayload) {}
}

export interface CastleEpisodeRanksFailurePayload {
  guid: string;
  group: string;
  filter?: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
  error: any;
}

export class CastleEpisodeRanksFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_RANKS_FAILURE;

  constructor(public payload: CastleEpisodeRanksFailurePayload) {}
}

export interface CastleEpisodeTotalsLoadPayload {
  guid: string;
  group: string;
  filter?: string;
  beginDate: Date;
  endDate: Date;
}

export class CastleEpisodeTotalsLoadAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_TOTALS_LOAD;

  constructor(public payload: CastleEpisodeTotalsLoadPayload) {}
}

export interface CastleEpisodeTotalsSuccessPayload {
  guid: string;
  group: string;
  filter?: string;
  beginDate: Date;
  endDate: Date;
  ranks: Rank[];
}

export class CastleEpisodeTotalsSuccessAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_TOTALS_SUCCESS;

  constructor(public payload: CastleEpisodeTotalsSuccessPayload) {}
}

export interface CastleEpisodeTotalsFailurePayload {
  guid: string;
  group: string;
  filter?: string;
  beginDate: Date;
  endDate: Date;
  error: any;
}

export class CastleEpisodeTotalsFailureAction implements Action {
  readonly type = ActionTypes.CASTLE_EPISODE_TOTALS_FAILURE;

  constructor(public payload: CastleEpisodeTotalsFailurePayload) {}
}
