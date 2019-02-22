import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EpisodeAllTimeDownloads } from './models/';
import { AllActions, ActionTypes } from '../actions';

export type State = EntityState<EpisodeAllTimeDownloads>;

export const adapter: EntityAdapter<EpisodeAllTimeDownloads> = createEntityAdapter<EpisodeAllTimeDownloads>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors();

export const selectEpisodeAllTimeDownloadsGuids = selectIds;
export const selectEpisodeAllTimeDownloadsEntities = selectEntities;
export const selectAllEpisodeAllTimeDownloads = selectAll;

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {

    case ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD: {
      const { guid, podcastId } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeAllTimeDownloadsEntities(state)[guid],
          guid, podcastId, error: null, loading: true, loaded: false
        }, state);
    }
    case ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_SUCCESS: {
      const { guid, podcastId, total } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeAllTimeDownloadsEntities(state)[guid],
          guid, podcastId, allTimeDownloads: total, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_FAILURE: {
      const { guid, podcastId, error } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeAllTimeDownloadsEntities(state)[guid],
          guid, podcastId, error, loading: false, loaded: false
        }, state);
    }

    default: {
      return state;
    }
  }
}

