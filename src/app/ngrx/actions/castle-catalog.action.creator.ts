import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { Podcast, Episode } from '..';

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



