import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { EpisodeTotals, episodeTotalsId, GroupType } from './models';
import * as totalsActions from '../actions/castle-ranks-totals.action.creator';
export type State = EntityState<EpisodeTotals>;

export const adapter: EntityAdapter<EpisodeTotals> = createEntityAdapter<EpisodeTotals>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const {
  selectIds: selectEpisodeTotalsIds,
  selectEntities: selectEpisodeTotalsEntities,
  selectAll: selectAllEpisodeTotals
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(totalsActions.CastleEpisodeTotalsLoad, (state, action) => {
    const { guid, group, filter, beginDate, endDate } = action;
    const id = episodeTotalsId(guid, group as GroupType, filter, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectEpisodeTotalsEntities[id],
        guid,
        group,
        filter,
        beginDate,
        endDate,
        error: null,
        loading: true,
        loaded: false
      },
      state
    );
  }),
  on(totalsActions.CastleEpisodeTotalsSuccess, (state, action) => {
    const { guid, group, filter, beginDate, endDate, ranks } = action;
    const id = episodeTotalsId(guid, group as GroupType, filter, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectEpisodeTotalsEntities[id],
        guid,
        group,
        filter,
        beginDate,
        endDate,
        ranks,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(totalsActions.CastleEpisodeTotalsFailure, (state, action) => {
    const { guid, group, filter, beginDate, endDate, error } = action;
    const id = episodeTotalsId(guid, group as GroupType, filter, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectEpisodeTotalsEntities[id],
        guid,
        group,
        filter,
        beginDate,
        endDate,
        error,
        loading: false,
        loaded: false
      },
      state
    );
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}
