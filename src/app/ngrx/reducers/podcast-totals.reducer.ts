import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastTotals, podcastTotalsId } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<PodcastTotals>;

export const adapter: EntityAdapter<PodcastTotals> = createEntityAdapter<PodcastTotals>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const {
  selectIds: selectPodcastTotalsIds,
  selectEntities: selectPodcastTotalsEntities,
  selectAll: selectAllPodcastTotals,
} = adapter.getSelectors();

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_TOTALS_LOAD: {
      const { podcastId, group, filter, beginDate, endDate } = action.payload;
      const id = podcastTotalsId(podcastId, group, filter, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastTotalsEntities(state)[id],
          podcastId, group, filter, beginDate, endDate, error: null, loading: true, loaded: false
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS: {
      const { podcastId, group, filter, beginDate, endDate, ranks } = action.payload;
      const id = podcastTotalsId(podcastId, group, filter, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastTotalsEntities(state)[id],
          podcastId, group, filter, beginDate, endDate, ranks, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE: {
      const { podcastId, group, filter, beginDate, endDate, error } = action.payload;
      const id = podcastTotalsId(podcastId, group, filter, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastTotalsEntities(state)[id],
          podcastId, group, filter, beginDate, endDate, error, loading: false, loaded: false
        }, state);
    }

    default: {
      return state;
    }
  }
}

