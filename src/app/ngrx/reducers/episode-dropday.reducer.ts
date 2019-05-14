import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions';
import { EpisodeDropday } from './models';

export type State = EntityState<EpisodeDropday>;

export const adapter: EntityAdapter<EpisodeDropday> = createEntityAdapter<EpisodeDropday>();

export const initialState: EntityState<EpisodeDropday> = adapter.getInitialState();

export const {
  selectIds: selectEpisodeDropdayGuids,
  selectEntities: selectEpisodeDropdayEntities,
  selectAll: selectAllEpisodeDropday
} = adapter.getSelectors();

export function reducer(state: State = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_DROPDAY_LOAD: {
      const { guid, podcastId, interval } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeDropdayEntities(state)[guid],
          guid, podcastId, interval, error: null, loading: true, loaded: false
        },
        state);
    }
    case ActionTypes.CASTLE_EPISODE_DROPDAY_SUCCESS: {
      const { guid, podcastId, interval, downloads } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeDropdayEntities(state)[guid],
          guid, podcastId, interval, downloads, loading: false, loaded: true
        },
        state);
    }
    case ActionTypes.CASTLE_EPISODE_DROPDAY_FAILURE: {
      const { guid, podcastId, interval, error } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeDropdayEntities(state)[guid],
          guid, podcastId, interval, error, loading: false, loaded: false
        },
        state);
    }
    default:
      return state;
  }
}
