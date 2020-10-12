import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { GroupType, PodcastTotals, podcastTotalsId } from './models';
import * as totalsActions from '../actions/castle-ranks-totals.action.creator';

export type State = EntityState<PodcastTotals>;

export const adapter: EntityAdapter<PodcastTotals> = createEntityAdapter<PodcastTotals>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const {
  selectIds: selectPodcastTotalsIds,
  selectEntities: selectPodcastTotalsEntities,
  selectAll: selectAllPodcastTotals
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(totalsActions.CastlePodcastTotalsLoad, (state, action) => {
    const { podcastId, group, filter, beginDate, endDate } = action;
    const id = podcastTotalsId(podcastId, group as GroupType, filter, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastTotalsEntities(state)[id],
        podcastId,
        group: group as GroupType,
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
  on(totalsActions.CastlePodcastTotalsSuccess, (state, action) => {
    const { podcastId, group, filter, beginDate, endDate, ranks } = action;
    const id = podcastTotalsId(podcastId, group as GroupType, filter, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastTotalsEntities(state)[id],
        podcastId,
        group: group as GroupType,
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
  on(totalsActions.CastlePodcastTotalsFailure, (state, action) => {
    const { podcastId, group, filter, beginDate, endDate, error } = action;
    const id = podcastTotalsId(podcastId, group as GroupType, filter, beginDate, endDate);
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastTotalsEntities(state)[id],
        podcastId,
        group: group as GroupType,
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
