import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastDownloads } from './models/';
import { AllActions, ActionTypes } from '../actions';

export type State = EntityState<PodcastDownloads>;

export const adapter: EntityAdapter<PodcastDownloads> = createEntityAdapter<PodcastDownloads>();

export const initialState: State = adapter.getInitialState({});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {

    case ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_LOAD: {
      const { id } = action.payload;
      return {
        ...adapter.upsertOne({
          id,
          changes: {
            id, error: null, loading: true, loaded: false
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_SUCCESS: {
      const { id, total } = action.payload;
      return {
        ...adapter.upsertOne({
          id,
          changes: {
            id, allTimeDownloads: total
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_FAILURE: {
      const { id, error } = action.payload;
      return {
        ...adapter.upsertOne({
          id,
          changes: {
            id, error, loading: false, loaded: false
          }
        }, state)
      };
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors();

export const selectPodcastDownloadsIds = selectIds;
export const selectPodcastDownloadsEntities = selectEntities;
export const selectAllPodcastDownloads = selectAll;
