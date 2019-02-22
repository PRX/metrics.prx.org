import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastRanks, podcastRanksId } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<PodcastRanks>;

export const adapter: EntityAdapter<PodcastRanks> = createEntityAdapter<PodcastRanks>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors();

export const selectPodcastRanksIds = selectIds;
export const selectPodcastRanksEntities = selectEntities;
export const selectAllPodcastRanks = selectAll;

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_RANKS_LOAD: {
      const { id, group, filter, interval, beginDate, endDate } = action.payload;
      const key = podcastRanksId(id, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id: key,
          ...selectPodcastRanksEntities(state)[key],
          podcastId: id, group, filter, interval, beginDate, endDate, error: null, loading: true, loaded: false
        },
        state);
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS: {
      const { id, group, filter, interval, beginDate, endDate, downloads, ranks } = action.payload;
      const key = podcastRanksId(id, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id: key,
          ...selectPodcastRanksEntities(state)[key],
          podcastId: id, group, filter, interval, beginDate, endDate, downloads, ranks, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_FAILURE: {
      const { id, group, filter, interval, beginDate, endDate, error } = action.payload;
      const key = podcastRanksId(id, group, filter, interval, beginDate, endDate);
      return adapter.upsertOne(
        {
          id: key,
          ...selectPodcastRanksEntities(state)[key],
          podcastId: id, group, filter, interval, beginDate, endDate, error, loading: false, loaded: false
        }, state);
    }

    default: {
      return state;
    }
  }
}
