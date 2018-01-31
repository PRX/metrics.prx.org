import { ActionTypes, CmsPodcastsSuccessAction, CmsPodcastsFailureAction, AllActions } from '../actions';
import { HalDoc } from 'ngx-prx-styleguide';

export interface PodcastModel {
  doc?: HalDoc;
  seriesId: number;
  title: string;
  feederUrl?: string;
  feederId?: string;
}

export interface PodcastState {
  entities?: {[seriesId: number]: PodcastModel};
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const initialState = {
  entities: {},
  loaded: false,
  loading: false
};

const podcastEntities = (state: PodcastState, podcasts: PodcastModel[]): {[seriesId: number]: PodcastModel} => {
  return podcasts.reduce(
    (entities: {[seriesId: number]: PodcastModel}, podcast: PodcastModel) => {
      return {
        ...entities,
        [podcast.seriesId]: podcast
      };
    },
    {
      ...state.entities
    }
  );
};

export function PodcastReducer(state: PodcastState = initialState, action: AllActions): PodcastState {
  switch (action.type) {
    case ActionTypes.CMS_PODCASTS: {
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false
      };
    }
    case ActionTypes.CMS_PODCASTS_SUCCESS:
      if (action instanceof CmsPodcastsSuccessAction) {
        const entities = podcastEntities(state, [...action.payload.podcasts]);
        return {
          ...state,
          entities,
          error: null,
          loading: false,
          loaded: true
        };
      }
      break;
    case ActionTypes.CMS_PODCASTS_FAILURE: {
      if (action instanceof CmsPodcastsFailureAction) {
        return {
          ...state,
          error: action.payload['error'],
          loading: false,
          loaded: false
        };
      }
      break;
    }
  }
  return state;
}

export const getPodcastEntities = (state: PodcastState) => state.entities;
export const getPodcastsLoading = (state: PodcastState) => state.loading;
export const getPodcastsLoaded = (state: PodcastState) => state.loaded;
export const getPodcastsError = (state: PodcastState) => state.error;
