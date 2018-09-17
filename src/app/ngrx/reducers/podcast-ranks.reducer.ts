import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastRanks, GROUPTYPE_GEOSUBDIV } from './models';
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
      const { id, group, filter, interval } = action.payload;
      const key = group === GROUPTYPE_GEOSUBDIV ? `${id}-${group}-${filter}-${interval.key}` : `${id}-${group}-${interval.key}`;
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, interval, error: null, loading: true, loaded: false
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS: {
      const { id, group, filter, interval, downloads, ranks } = action.payload;
      const key = group === GROUPTYPE_GEOSUBDIV ? `${id}-${group}-${filter}-${interval.key}` : `${id}-${group}-${interval.key}`;
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, interval, downloads, ranks, loading: false, loaded: true
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_FAILURE: {
      const { id, group, filter, interval, error } = action.payload;
      const key = group === GROUPTYPE_GEOSUBDIV ? `${id}-${group}-${filter}-${interval.key}` : `${id}-${group}-${interval.key}`;
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, interval, error, loading: false, loaded: false
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
