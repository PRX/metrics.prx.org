import { Action } from '@ngrx/store';
import { ActionTypes, ActionWithPayload } from './action.types';
import { EpisodeModel, PodcastModel } from '../model';

export interface CmsPodcastsPayload {
  podcasts: PodcastModel[];
}

export class CmsPodcastsSuccessAction implements ActionWithPayload<CmsPodcastsPayload> {
  readonly type = ActionTypes.CMS_PODCASTS_SUCCESS;

  constructor(public payload: CmsPodcastsPayload) {}
}

export class CmsPodcastsFailureAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS_FAILURE;
}

export class CmsPodcastsAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS;
}

export interface CmsEpisodeGuidsPayload {
  podcast: PodcastModel;
  episodes: EpisodeModel[];
}

export class CmsAllPodcastEpisodeGuidsAction implements ActionWithPayload<CmsEpisodeGuidsPayload> {
  readonly type = ActionTypes.CMS_ALL_PODCAST_EPISODE_GUIDS;

  constructor(public payload: CmsEpisodeGuidsPayload) {}
}

