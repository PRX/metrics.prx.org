import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EpisodeDownloads } from './models/';
import { AllActions, ActionTypes } from '../actions';

export type State = EntityState<EpisodeDownloads>;

export const adapter: EntityAdapter<EpisodeDownloads> = createEntityAdapter<EpisodeDownloads>({
  selectId: (e: EpisodeDownloads) => e.guid,
});

export const initialState: State = adapter.getInitialState({});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {

    case ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD: {
      const { guid, podcastId } = action.payload;
      return {
        ...adapter.upsertOne({
          id: guid,
          changes: {
            guid, podcastId, error: null, loading: true, loaded: false
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_SUCCESS: {
      const { guid, podcastId, total } = action.payload;
      return {
        ...adapter.upsertOne({
          id: guid,
          changes: {
            guid, podcastId, allTimeDownloads: total
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_FAILURE: {
      const { guid, podcastId, error } = action.payload;
      return {
        ...adapter.upsertOne({
          id: guid,
          changes: {
            guid, podcastId, error, loading: false, loaded: false
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

export const selectEpisodeDownloadsGuids = selectIds;
export const selectEpisodeDownloadsEntities = selectEntities;
export const selectAllEpisodeDownloads = selectAll;
