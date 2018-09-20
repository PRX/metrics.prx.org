import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastTotals, GROUPTYPE_GEOSUBDIV } from './models';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<PodcastTotals> {
  // additional entities state properties
}

export const adapter: EntityAdapter<PodcastTotals> = createEntityAdapter<PodcastTotals>({
  selectId: ((p: PodcastTotals) => p.key)
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_TOTALS_LOAD: {
      const { id, group, filter } = action.payload;
      const key = group === GROUPTYPE_GEOSUBDIV ? `${id}-${group}-${filter}` : `${id}-${group}`;
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, error: null, loading: true, loaded: false
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS: {
      const { id, group, filter, ranks } = action.payload;
      const key = group === GROUPTYPE_GEOSUBDIV ? `${id}-${group}-${filter}` : `${id}-${group}`;
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, ranks, loading: false, loaded: true
          }
        }, state)
      };
    }
    case ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE: {
      const { id, group, filter, error } = action.payload;
      const key = group === GROUPTYPE_GEOSUBDIV ? `${id}-${group}-${filter}` : `${id}-${group}`;
      return {
        ...adapter.upsertOne({
          id: key,
          changes: {
            key, podcastId: id, group, filter, error, loading: false, loaded: false
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

export const selectPodcastTotalsKeys = selectIds;
export const selectPodcastTotalsEntities = selectEntities;
export const selectAllPodcastTotals = selectAll;
