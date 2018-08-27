import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastTotals } from './models/podcast-totals.model';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<PodcastTotals> {
  // additional entities state properties
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const adapter: EntityAdapter<PodcastTotals> = createEntityAdapter<PodcastTotals>({
  selectId: ((p: PodcastTotals) => p.key)
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
    case ActionTypes.CASTLE_PODCAST_TOTALS_LOAD: {
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null
      };
    }
    case ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS: {
      const { id, group, downloads, ranks } = action.payload;
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return {
        ...adapter.upsertOne({
          id: `${id}-${group}`,
          changes: {
            key: `${id}-${group}`, podcastId: id, group, downloads, ranks
          }
        }, state),
        loading: false,
        loaded: true
      };
    }
    case ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE: {
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

export const selectPodcastTotalsKeys = selectIds;
export const selectPodcastTotalsEntities = selectEntities;
export const selectAllPodcastTotals = selectAll;

export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
