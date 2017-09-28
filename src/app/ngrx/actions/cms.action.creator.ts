import { ActionTypes, ActionWithPayload } from './action.types';
import { EpisodeModel, PodcastModel } from '../model';

export interface CmsPodcastFeedPayload {
  podcast: PodcastModel;
}

export class CmsPodcastFeedAction implements ActionWithPayload<CmsPodcastFeedPayload> {
  readonly type = ActionTypes.CMS_PODCAST_FEED;

  constructor(public payload: CmsPodcastFeedPayload) {}
}

export interface CmsEpisodeGuidPayload {
  podcast: PodcastModel;
  episode: EpisodeModel;
}

export class CmsEpisodeGuidAction implements ActionWithPayload<CmsEpisodeGuidPayload> {
  readonly type = ActionTypes.CMS_EPISODE_GUID;

  constructor(public payload: CmsEpisodeGuidPayload) {}
}

