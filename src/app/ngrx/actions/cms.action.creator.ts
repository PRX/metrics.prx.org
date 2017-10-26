import { ActionTypes, ActionWithPayload } from './action.types';
import { EpisodeModel, PodcastModel } from '../model';

export interface CmsPodcastFeedPayload {
  podcast: PodcastModel;
}

export class CmsPodcastFeedAction implements ActionWithPayload<CmsPodcastFeedPayload> {
  readonly type = ActionTypes.CMS_PODCAST_FEED;

  constructor(public payload: CmsPodcastFeedPayload) {}
}

export interface CmsEpisodeGuidsPayload {
  podcast: PodcastModel;
  episodes: EpisodeModel[];
}

export class CmsAllPodcastEpisodeGuidsAction implements ActionWithPayload<CmsEpisodeGuidsPayload> {
  readonly type = ActionTypes.CMS_ALL_PODCAST_EPISODE_GUIDS;

  constructor(public payload: CmsEpisodeGuidsPayload) {}
}

