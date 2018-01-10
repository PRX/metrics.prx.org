import { ActionTypes, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction, AllActions  } from '../actions';
import { HalDoc } from 'ngx-prx-styleguide';

export const EPISODE_PAGE_SIZE = 10;

export interface EpisodeModel {
  doc?: HalDoc;
  id: number;
  seriesId: number;
  title: string;
  publishedAt: Date;
  page?: number;
  color?: string;
  feederUrl?: string;
  guid?: string;
}

export interface EpisodeState {
  entities?: {[id: number]: EpisodeModel};
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const initialState = {
  entities: {},
  loaded: false,
  loading: false
};

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

export function EpisodeReducer(state: EpisodeState = initialState, action: AllActions): EpisodeState {
  switch (action.type) {
    case ActionTypes.CMS_PODCAST_EPISODE_PAGE: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }
    case ActionTypes.CMS_PODCAST_EPISODE_PAGE_SUCCESS:
      if (action instanceof CmsPodcastEpisodePageSuccessAction) {
        const entities = episodeEntities(state, action.payload.episodes);
        return {
          ...state,
          entities,
          loading: false,
          loaded: true
        };
      }
      break;
    case ActionTypes.CMS_PODCAST_EPISODE_PAGE_FAILURE: {
      if (action instanceof CmsPodcastEpisodePageFailureAction) {
        return {
          ...state,
          error: action.payload.error,
          loading: false,
          loaded: false
        };
      }
    }
  }
  return state;
}

export const getEpisodeEntities = (state: EpisodeState) => state.entities;
