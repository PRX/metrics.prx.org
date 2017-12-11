import { ActionTypes, CmsPodcastsAction, AllActions } from '../actions';
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
}

export const initialState = {
  entities: {}
};

// TODO: initialState _was_ undefined, not yet loaded; so when empty, no podcasts
export function PodcastReducer(state: PodcastState = initialState, action: AllActions): PodcastState {
  switch (action.type) {
    case ActionTypes.CMS_PODCASTS:
      if (action instanceof CmsPodcastsAction) {
        const entities = podcastEntities(state, [...action.payload.podcasts]);
        return {
          ...state,
          entities
        };
      }
      break;
  }
  return state;
}

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

export const getPodcastEntities = (state: PodcastState) => state.entities;
