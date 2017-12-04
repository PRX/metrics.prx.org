import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { EpisodeModel, PodcastModel } from '../model';

export interface CmsPodcastsPayload {
  podcasts: PodcastModel[];
}

export class CmsPodcastsAction implements Action {
  readonly type = ActionTypes.CMS_PODCASTS;

  constructor(public payload: CmsPodcastsPayload) {}
}

export interface CmsEpisodeGuidsPayload {
  podcast: PodcastModel;
  episodes: EpisodeModel[];
}

export class CmsAllPodcastEpisodeGuidsAction implements Action {
  readonly type = ActionTypes.CMS_ALL_PODCAST_EPISODE_GUIDS;

  constructor(public payload: CmsEpisodeGuidsPayload) {}
}
