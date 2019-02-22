import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EpisodeRanks, episodeRanksId } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<EpisodeRanks>;

export const adapter: EntityAdapter<EpisodeRanks> = createEntityAdapter<EpisodeRanks>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors();

export const selectEpisodeRanksIds = selectIds;
export const selectEpisodeRanksEntities = selectEntities;
export const selectAllEpisodeRanks = selectAll;

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_RANKS_LOAD: {
      const { guid, group, filter, interval, beginDate, endDate } = action.payload;
      const id = episodeRanksId(guid, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectEpisodeRanksEntities(state)[id],
          guid, group, filter, interval, beginDate, endDate, error: null, loading: true, loaded: false
        }, state);
    }
    case ActionTypes.CASTLE_EPISODE_RANKS_SUCCESS: {
      const { guid, group, filter, interval, beginDate, endDate, downloads, ranks } = action.payload;
      const id = episodeRanksId(guid, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectEpisodeRanksEntities(state)[id],
          guid, group, filter, interval, beginDate, endDate, downloads, ranks, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CASTLE_EPISODE_RANKS_FAILURE: {
      const { guid, group, filter, interval, beginDate, endDate, error } = action.payload;
      const id = episodeRanksId(guid, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectEpisodeRanksEntities(state)[id],
          guid, group, filter, interval, beginDate, endDate, error, loading: false, loaded: false
        }, state);
    }

    default: {
      return state;
    }
  }
}
