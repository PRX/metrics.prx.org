import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { EpisodeModel } from '../model';
import { PodcastModel } from '../reducers';

export interface CmsPodcastsPayload {
  podcasts: PodcastModel[];
}

export class CmsPodcastsAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS;

  constructor(public payload: CmsPodcastsPayload) {}
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
