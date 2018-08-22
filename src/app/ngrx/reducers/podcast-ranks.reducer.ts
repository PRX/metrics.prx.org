import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastRanks } from './models/podcast-ranks.model';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<PodcastRanks> {
  // additional entities state properties
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const adapter: EntityAdapter<PodcastRanks> = createEntityAdapter<PodcastRanks>({
  selectId: ((p: PodcastRanks) => p.key)
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false,
  loading: false
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_RANKS_LOAD: {
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null
      };
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS: {
      const { id, group, interval, downloads, ranks } = action.payload;
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return {
        ...adapter.upsertOne({
          id: `${id}-${group}-${interval.key}`,
          changes: {
            key: `${id}-${group}-${interval.key}`, podcastId: id, group, interval, downloads, ranks
          }
        }, state),
        loading: false,
        loaded: true
      };
    }
    case ActionTypes.CASTLE_PODCAST_RANKS_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        loaded: false,
        error
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

export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
