import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions';
import { PodcastListeners } from './models/podcast-listeners.model';

export type PodcastListenersState = EntityState<PodcastListeners>;

export const adapter: EntityAdapter<PodcastListeners> = createEntityAdapter<PodcastListeners>();

export const initialState: EntityState<PodcastListeners> = adapter.getInitialState();

export const {
  selectIds: selectPodcastListenersIds,
  selectEntities: selectPodcastListenersEntities,
  selectAll: selectAllPodcastListeners,
  selectTotal: selectTotalPodcastListeners
} = adapter.getSelectors();

export function PodcastListenersReducer(state: PodcastListenersState = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_LISTENERS_LOAD: {
      const { id } = action.payload;
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastListenersEntities(state)[id],
          error: null,
          loading: true,
          loaded: false
        },
        state
      );
    }
    case ActionTypes.CASTLE_PODCAST_LISTENERS_SUCCESS: {
      const { id, listeners } = action.payload;
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastListenersEntities(state)[id],
          listeners,
          loading: false,
          loaded: true
        },
        state
      );
    }
    case ActionTypes.CASTLE_PODCAST_LISTENERS_FAILURE: {
      const { id, error } = action.payload;
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastListenersEntities(state)[id],
          error,
          loading: false,
          loaded: true
        },
        state
      );
    }
    default:
      return state;
  }
}
