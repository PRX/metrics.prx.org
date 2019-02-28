import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Podcast } from './models/podcast.model';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<Podcast> {
  // additional entities state properties
  error?: any;
}

export function sortByTitle(a: Podcast, b: Podcast) {
  return a.title.localeCompare(b.title);
}

export const adapter: EntityAdapter<Podcast> = createEntityAdapter<Podcast>({
  sortComparer: sortByTitle
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_PAGE_LOAD: {
      return {
        ...state,
        error: null
      };
    }
    case ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS: {
      return adapter.upsertMany(action.payload.podcasts, state);
    }
    case ActionTypes.CASTLE_PODCAST_PAGE_FAILURE: {
      return { ...state, error: action.payload.error};
    }
    default: {
      return state;
    }
  }
}

export const {
  selectIds: selectPodcastIds,
  selectEntities: selectPodcastEntities,
  selectAll: selectAllPodcasts,
} = adapter.getSelectors();

export const getError = (state: State) => state.error;
