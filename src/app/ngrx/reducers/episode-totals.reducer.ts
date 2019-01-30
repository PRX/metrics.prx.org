import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EpisodeTotals, episodeTotalsKey } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<EpisodeTotals>;

export const adapter: EntityAdapter<EpisodeTotals> = createEntityAdapter<EpisodeTotals>({
  selectId: ((p: EpisodeTotals) => p.key)
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_TOTALS_LOAD: {
      const { guid, group, filter, beginDate, endDate } = action.payload;
      const key = episodeTotalsKey(guid, group, filter, beginDate, endDate);
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, guid, group, filter, beginDate, endDate, error: null, loading: true, loaded: false
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_EPISODE_TOTALS_SUCCESS: {
      const { guid, group, filter, beginDate, endDate, ranks } = action.payload;
      const key = episodeTotalsKey(guid, group, filter, beginDate, endDate);
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, guid, group, filter, beginDate, endDate, ranks, loading: false, loaded: true
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_EPISODE_TOTALS_FAILURE: {
      const { guid, group, filter, beginDate, endDate, error } = action.payload;
      const key = episodeTotalsKey(guid, group, filter, beginDate, endDate);
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, guid, group, filter, beginDate, endDate, error, loading: false, loaded: false
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

export const selectEpisodeTotalsKeys = selectIds;
export const selectEpisodeTotalsEntities = selectEntities;
export const selectAllEpisodeTotals = selectAll;
