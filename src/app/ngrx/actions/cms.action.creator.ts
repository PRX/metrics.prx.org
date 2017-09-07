import ActionTypes from './action.types';
import { EpisodeModel, PodcastModel } from '../../shared';

export const cmsPodcastFeed = (podcast: PodcastModel) => {
  return {
    type: ActionTypes.CMS_PODCAST_FEED,
    payload: {
      podcast
    }
  };
};

export const cmsEpisodeGuid = (podcast: PodcastModel, episode: EpisodeModel) => {
  return {
    type: ActionTypes.CMS_EPISODE_GUID,
    payload: {
      podcast,
      episode
    }
  };
};
