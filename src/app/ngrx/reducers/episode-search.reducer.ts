import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Episode } from './models/episode.model';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<Episode> {
  selected?: string[];
  total: number;
  page: number;
  loading: boolean;
  error?: any;
}

export const adapter: EntityAdapter<Episode> = createEntityAdapter<Episode>({
  selectId: (e: Episode) => e.guid,
});

export const initialState: State = adapter.getInitialState({
  total: 0,
  page: 0,
  loading: false
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_SEARCH_PAGE_LOAD: {
      return {...state, error: null, loading: true};
    }
    case ActionTypes.CASTLE_EPISODE_SEARCH_PAGE_SUCCESS: {
      const { page, total, episodes } = action.payload;
      return {
        ...adapter.upsertMany(episodes.map(episode => {
          return {id: episode.guid, changes: episode};
        }), state),
        total,
        page,
        loading: false
      };
    }
    case ActionTypes.CASTLE_EPISODE_SEARCH_PAGE_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };
    }
    case ActionTypes.EPISODE_SEARCH_SELECT_EPISODES: {
      return {
        ...state,
        selected: action.payload.episodeGuids
      };
    }
    case ActionTypes.ROUTE_PODCAST: {
      return {
        ...state,
        total: 0,
        page: 0,
        selected: null
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

export const selectEpisodeGuids = selectIds;
export const selectEpisodeEntities = selectEntities;
export const selectAllEpisodes = selectAll;

export const getTotal = (state: State) => state.total;
export const getPage = (state: State) => state.page;
export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
export const getSelected = (state: State) => state.selected;
