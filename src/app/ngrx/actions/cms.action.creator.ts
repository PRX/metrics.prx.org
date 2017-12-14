import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { EpisodeModel } from '../model';
import { PodcastModel } from '../reducers';

export class CmsPodcastsAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS;
}

export interface CmsPodcastsSuccessPayload {
  podcasts: PodcastModel[];
}

export class CmsPodcastsSuccessAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS_SUCCESS;

  constructor(public payload: CmsPodcastsSuccessPayload) {}
}

export class CmsPodcastsFailureAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS_FAILURE;

  constructor(public payload: any) {}
}

export interface CmsEpisodePagePayload {
  podcast: PodcastModel;
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
