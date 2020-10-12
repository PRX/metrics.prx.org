import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { GroupType, PodcastRanks, podcastRanksId } from './models';
import * as ranksActions from '../actions/castle-ranks-totals.action.creator';

export type State = EntityState<PodcastRanks>;

export const adapter: EntityAdapter<PodcastRanks> = createEntityAdapter<PodcastRanks>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds: selectPodcastRanksIds,
  selectEntities: selectPodcastRanksEntities,
  selectAll: selectAllPodcastRanks
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(ranksActions.CastlePodcastRanksLoad, (state, action) => {
    const { podcastId, group, filter, interval, beginDate, endDate } = action;
    const id = podcastRanksId(podcastId, group as GroupType, filter, interval, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastRanksEntities(state)[id],
        podcastId,
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
  on(ranksActions.CastlePodcastRanksSuccess, (state, action) => {
    const { podcastId, group, filter, interval, beginDate, endDate, downloads, ranks } = action;
    const id = podcastRanksId(podcastId, group as GroupType, filter, interval, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastRanksEntities(state)[id],
        podcastId,
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
  on(ranksActions.CastlePodcastRanksFailure, (state, action) => {
    const { podcastId, group, filter, interval, beginDate, endDate, error } = action;
    const id = podcastRanksId(podcastId, group as GroupType, filter, interval, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastRanksEntities(state)[id],
        podcastId,
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
