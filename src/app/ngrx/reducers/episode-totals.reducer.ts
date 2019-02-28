import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { EpisodeTotals, episodeTotalsId } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<EpisodeTotals>;

export const adapter: EntityAdapter<EpisodeTotals> = createEntityAdapter<EpisodeTotals>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const {
  selectIds: selectEpisodeTotalsIds,
  selectEntities: selectEpisodeTotalsEntities,
  selectAll: selectAllEpisodeTotals,
} = adapter.getSelectors();

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_TOTALS_LOAD: {
      const { guid, group, filter, beginDate, endDate } = action.payload;
      const id = episodeTotalsId(guid, group, filter, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectEpisodeTotalsEntities[id],
          guid, group, filter, beginDate, endDate, error: null, loading: true, loaded: false
        }, state);
    }
    case ActionTypes.CASTLE_EPISODE_TOTALS_SUCCESS: {
      const { guid, group, filter, beginDate, endDate, ranks } = action.payload;
      const id = episodeTotalsId(guid, group, filter, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectEpisodeTotalsEntities[id],
          guid, group, filter, beginDate, endDate, ranks, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CASTLE_EPISODE_TOTALS_FAILURE: {
      const { guid, group, filter, beginDate, endDate, error } = action.payload;
      const id = episodeTotalsId(guid, group, filter, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectEpisodeTotalsEntities[id],
          guid, group, filter, beginDate, endDate, error, loading: false, loaded: false
        }, state);
    }

    default: {
      return state;
    }
  }
}

