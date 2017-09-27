import { CmsPodcastFeedAction, CmsEpisodeGuidAction } from './action.types';
import { EpisodeModel, PodcastModel } from '../model';

// TODO: action creators are now classes, so I can get rid of these wrappers and just do new XyzAction()

export const cmsPodcastFeed = (podcast: PodcastModel): CmsPodcastFeedAction => {
  return new CmsPodcastFeedAction({podcast});
};

export const cmsEpisodeGuid = (podcast: PodcastModel, episode: EpisodeModel): CmsEpisodeGuidAction => {
  return new CmsEpisodeGuidAction({podcast, episode});
};
