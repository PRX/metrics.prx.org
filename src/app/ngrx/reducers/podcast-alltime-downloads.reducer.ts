import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastAllTimeDownloads } from './models/';
import { AllActions, ActionTypes } from '../actions';

export type State = EntityState<PodcastAllTimeDownloads>;

export const adapter: EntityAdapter<PodcastAllTimeDownloads> = createEntityAdapter<PodcastAllTimeDownloads>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors();

export const selectPodcastAllTimeDownloadsIds = selectIds;
export const selectPodcastAllTimeDownloadsEntities = selectEntities;
export const selectAllPodcastAllTimeDownloads = selectAll;

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {

    case ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_LOAD: {
      const { id } = action.payload;
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastAllTimeDownloadsEntities(state)[id],
          error: null, loading: true, loaded: false
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_SUCCESS: {
      const { id, total } = action.payload;
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastAllTimeDownloadsEntities(state)[id],
          allTimeDownloads: total, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_FAILURE: {
      const { id, error } = action.payload;
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastAllTimeDownloadsEntities(state)[id],
          error, loading: false, loaded: false
        }, state);
    }

    default: {
      return state;
    }
  }
}

