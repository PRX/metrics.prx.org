import { ActionTypes, AllActions } from '../actions';
import { EpisodeModel } from './episode.reducer';

interface RecentEpisodeLookup {
  [seriesId: number]: EpisodeModel;
}

export interface RecentEpisodeState {
  entities?: RecentEpisodeLookup;
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const initialState = {
  entities: {},
  loaded: false,
  loading: false
};

const recentEpisodeEntities = (state: RecentEpisodeState, episode: EpisodeModel): RecentEpisodeLookup => {
  return {...state.entities, [episode.seriesId]: episode};
};

export function RecentEpisodeReducer(state: RecentEpisodeState = initialState, action: AllActions): RecentEpisodeState {
  switch (action.type) {
    case ActionTypes.CMS_RECENT_EPISODE: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }
    case ActionTypes.CMS_RECENT_EPISODE_SUCCESS: {
      const entities = recentEpisodeEntities(state, action.payload.episode);
      return {
        ...state,
        entities,
        loading: false,
        loaded: true
      };
    }
    case ActionTypes.CMS_RECENT_EPISODE_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
        loaded: false
      };
    }
  }
  return state;
}

export const getRecentEpisodeEntities = (state: RecentEpisodeState) => state.entities;
export const getRecentEpisodeLoading = (state: RecentEpisodeState) => state.loading;
export const getRecentEpisodeLoaded = (state: RecentEpisodeState) => state.loaded;
export const getRecentEpisodeError = (state: RecentEpisodeState) => state.error;
