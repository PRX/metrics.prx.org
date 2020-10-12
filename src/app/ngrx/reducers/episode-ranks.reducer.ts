import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { EpisodeRanks, episodeRanksId, GroupType } from './models';
import * as ranksActions from '../actions/castle-ranks-totals.action.creator';

export type State = EntityState<EpisodeRanks>;

export const adapter: EntityAdapter<EpisodeRanks> = createEntityAdapter<EpisodeRanks>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds: selectEpisodeRanksIds,
  selectEntities: selectEpisodeRanksEntities,
  selectAll: selectAllEpisodeRanks
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(ranksActions.CastleEpisodeRanksLoad, (state, action) => {
    const { guid, group, filter, interval, beginDate, endDate } = action;
    const id = episodeRanksId(guid, group as GroupType, filter, interval, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectEpisodeRanksEntities(state)[id],
        guid,
        group: group as GroupType,
        filter,
        interval,
        beginDate,
        endDate,
        error: null,
        loading: true,
        loaded: false
      },
      state
    );
  }),
  on(ranksActions.CastleEpisodeRanksSuccess, (state, action) => {
    const { guid, group, filter, interval, beginDate, endDate, downloads, ranks } = action;
    const id = episodeRanksId(guid, group as GroupType, filter, interval, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectEpisodeRanksEntities(state)[id],
        guid,
        group: group as GroupType,
        filter,
        interval,
        beginDate,
        endDate,
        downloads,
        ranks,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(ranksActions.CastleEpisodeRanksFailure, (state, action) => {
    const { guid, group, filter, interval, beginDate, endDate, error } = action;
    const id = episodeRanksId(guid, group as GroupType, filter, interval, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectEpisodeRanksEntities(state)[id],
        guid,
        group: group as GroupType,
        filter,
        interval,
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
