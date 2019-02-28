import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastRanks, podcastRanksId } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<PodcastRanks>;

export const adapter: EntityAdapter<PodcastRanks> = createEntityAdapter<PodcastRanks>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds: selectPodcastRanksIds,
  selectEntities: selectPodcastRanksEntities,
  selectAll: selectAllPodcastRanks,
} = adapter.getSelectors();

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_RANKS_LOAD: {
      const { podcastId, group, filter, interval, beginDate, endDate } = action.payload;
      const id = podcastRanksId(podcastId, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastRanksEntities(state)[id],
          podcastId, group, filter, interval, beginDate, endDate, error: null, loading: true, loaded: false
        },
        state);
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS: {
      const { podcastId, group, filter, interval, beginDate, endDate, downloads, ranks } = action.payload;
      const id = podcastRanksId(podcastId, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastRanksEntities(state)[id],
          podcastId, group, filter, interval, beginDate, endDate, downloads, ranks, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_FAILURE: {
      const { podcastId, group, filter, interval, beginDate, endDate, error } = action.payload;
      const id = podcastRanksId(podcastId, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastRanksEntities(state)[id],
          podcastId, group, filter, interval, beginDate, endDate, error, loading: false, loaded: false
        }, state);
    }

    default: {
      return state;
    }
  }
}
