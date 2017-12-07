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

export interface CmsEpisodeGuidsPayload {
  episodes: EpisodeModel[];
}

export class CmsAllPodcastEpisodeGuidsAction implements Action {
  readonly type = ActionTypes.CMS_ALL_PODCAST_EPISODE_GUIDS;

  constructor(public payload: CmsEpisodeGuidsPayload) {}
}
