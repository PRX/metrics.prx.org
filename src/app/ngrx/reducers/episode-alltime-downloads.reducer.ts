import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EpisodeAllTimeDownloads } from './models/';
import { AllActions, ActionTypes } from '../actions';

export type State = EntityState<EpisodeAllTimeDownloads>;

export const adapter: EntityAdapter<EpisodeAllTimeDownloads> = createEntityAdapter<EpisodeAllTimeDownloads>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds: selectEpisodeAllTimeDownloadsGuids,
  selectEntities: selectEpisodeAllTimeDownloadsEntities,
  selectAll: selectAllEpisodeAllTimeDownloads,
} = adapter.getSelectors();

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

