import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { AccountModel, PodcastModel, EpisodeModel } from '../';

export class CmsAccountAction implements Action {
  readonly type = ActionTypes.CMS_ACCOUNT;

  constructor(public payload = {}) {}
}

export interface CmsAccountSuccessPayload {
  account: AccountModel;
}

export class CmsAccountSuccessAction implements Action {
  readonly type = <string>ActionTypes.CMS_ACCOUNT_SUCCESS;
  constructor(public payload: CmsAccountSuccessPayload) {}
}

export class CmsAccountFailureAction implements Action {
  readonly type = ActionTypes.CMS_ACCOUNT_FAILURE;
  constructor(public payload: any) {}
}

export class CmsPodcastsAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS;

  constructor(public payload = {}) {}
}

export interface CmsPodcastsSuccessPayload {
  podcasts: PodcastModel[];
}

export class CmsPodcastsSuccessAction implements Action {
  readonly type = <string>ActionTypes.CMS_PODCASTS_SUCCESS;

  constructor(public payload: CmsPodcastsSuccessPayload) {}
}

export class CmsPodcastsFailureAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS_FAILURE;

  constructor(public payload: any) {}
}

export interface CmsRecentEpisodePayload {
  seriesId: number;
}

export class CmsRecentEpisodeAction implements Action {
  readonly type = ActionTypes.CMS_RECENT_EPISODE;
  constructor(public payload: CmsRecentEpisodePayload) {}
}

export interface CmsRecentEpisodeSuccessPayload {
  episode: EpisodeModel;
}

export class CmsRecentEpisodeSuccessAction implements Action {
  readonly type = <string>ActionTypes.CMS_RECENT_EPISODE_SUCCESS;
  constructor(public payload: CmsRecentEpisodeSuccessPayload) {}
}

export class CmsRecentEpisodeFailureAction implements Action {
  readonly type = ActionTypes.CMS_RECENT_EPISODE_FAILURE;
  constructor(public payload: any) {}
}

export interface CmsEpisodePagePayload {
  seriesId: number;
  page: number;
}

export class CmsPodcastEpisodePageAction implements Action {
  readonly type = ActionTypes.CMS_PODCAST_EPISODE_PAGE;

  constructor(public payload: CmsEpisodePagePayload) {}
}

export interface CmsEpisodePageSuccessPayload {
  episodes: EpisodeModel[];
}

export class CmsPodcastEpisodePageSuccessAction implements Action {
  readonly type = ActionTypes.CMS_PODCAST_EPISODE_PAGE_SUCCESS;

  constructor(public payload: CmsEpisodePageSuccessPayload) {}
}

export class CmsPodcastEpisodePageFailureAction implements Action {
  readonly type = ActionTypes.CMS_PODCAST_EPISODE_PAGE_FAILURE;

  constructor(public payload: any) {}
}
