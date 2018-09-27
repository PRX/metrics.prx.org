import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastRanks, podcastRanksKey } from './models';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<PodcastRanks> {
  // additional entities state properties
}

export const adapter: EntityAdapter<PodcastRanks> = createEntityAdapter<PodcastRanks>({
  selectId: ((p: PodcastRanks) => p.key)
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_RANKS_LOAD: {
      const { id, group, filter, interval, beginDate, endDate } = action.payload;
      const key = podcastRanksKey(id, group, filter, interval, beginDate, endDate);
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, interval, beginDate, endDate, error: null, loading: true, loaded: false
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS: {
      const { id, group, filter, interval, beginDate, endDate, downloads, ranks } = action.payload;
      const key = podcastRanksKey(id, group, filter, interval, beginDate, endDate);
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, interval, beginDate, endDate, downloads, ranks, loading: false, loaded: true
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_FAILURE: {
      const { id, group, filter, interval, beginDate, endDate, error } = action.payload;
      const key = podcastRanksKey(id, group, filter, interval, beginDate, endDate);
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, interval, beginDate, endDate, error, loading: false, loaded: false
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

export const selectPodcastRanksKeys = selectIds;
export const selectPodcastRanksEntities = selectEntities;
export const selectAllPodcastRanks = selectAll;
