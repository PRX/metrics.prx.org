import { ActionTypes, CmsAllPodcastEpisodeGuidsAction, AllActions  } from '../actions';
import { HalDoc } from 'ngx-prx-styleguide';

export interface EpisodeModel {
  doc?: HalDoc;
  id: number;
  seriesId: number;
  title: string;
  publishedAt: Date;
  feederUrl?: string;
  guid?: string;
};

export interface EpisodeState {
  entities?: {[id: number]: EpisodeModel};
};

export const initialState = {
  entities: {}
};

export function EpisodeReducer(state: EpisodeState = initialState, action: AllActions): EpisodeState {
  switch (action.type) {
    case ActionTypes.CMS_ALL_PODCAST_EPISODE_GUIDS:
      if (action instanceof CmsAllPodcastEpisodeGuidsAction) {
        const entities = episodeEntities(state, action.payload.episodes);
        return {
          ...state,
          entities
        };
        // TODO:? in selector?
        // sortEpisodesByReleaseDate(newState);
      }
      break;
  }
  return state;
}

const episodeEntities = (state: EpisodeState, episodes: EpisodeModel[]): {[id: number]: EpisodeModel} => {
  return episodes.reduce(
    (entities: {[id: number]: EpisodeModel}, episode: EpisodeModel) => {
      return {
        ...entities,
        [episode.id]: episode
      };
    },
    {
      ...state.entities
    }
  );
};

export const getEpisodeEntities = (state: EpisodeState) => state.entities;

const sortEpisodesByReleaseDate = (episodes: EpisodeModel[]) => {
  // sort the episodes by seriesId, publishedAt
  episodes.sort((a: EpisodeModel, b: EpisodeModel) => {
    if (a.seriesId !== b.seriesId) {
      return a.seriesId - b.seriesId;
    } else {
      return b.publishedAt.valueOf() - a.publishedAt.valueOf();
    }
  });
};
