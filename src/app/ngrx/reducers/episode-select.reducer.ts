import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Episode } from './models/episode.model';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<Episode> {
  selected?: string[];
  total: number;
  page: number;
  search?: string;
  searchTotal?: number;
  loading: boolean;
  error?: any;
}

export const adapter: EntityAdapter<Episode> = createEntityAdapter<Episode>({
  selectId: (e: Episode) => e.guid,
});

export const initialState: State = adapter.getInitialState({
  total: null,
  page: null,
  loading: false
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_SELECT_PAGE_LOAD: {
      const { page, search } = action.payload;
      // if the search term has changed, clear episodes
      if (search !== state.search) {
        return {
          ...adapter.removeAll(state),
          page,
          search,
          error: null,
          loading: true
        };
      } else {
        return {
          ...state,
          page,
          search,
          error: null,
          loading: true
        };
      }
    }
    case ActionTypes.CASTLE_EPISODE_SELECT_PAGE_SUCCESS: {
      const { page, total, search, episodes } = action.payload;
      return {
        ...adapter.upsertMany(episodes.map(episode => {
          return {id: episode.guid, changes: episode};
        }), state),
        // this here assumes that a CASTLE_EPISODE_SELECT_PAGE_SUCCESS will occur without search on application load
        // so that we can retain the unfiltered total amount of episodes
        ...(!search && {total}), // updates total property if search is not defined
        searchTotal: total, // search total is the total amount of filtered or unfiltered episodes, whereas total is only unfiltered
        page,
        loading: false
      };
    }
    case ActionTypes.CASTLE_EPISODE_SELECT_PAGE_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };
    }
    case ActionTypes.EPISODE_SELECT_EPISODES: {
      return {
        ...state,
        selected: action.payload.episodeGuids
      };
    }
    case ActionTypes.ROUTE_PODCAST: {
      return {
        ...state,
        total: null,
        page: null,
        selected: null,
        search: null
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
export const getSelected = (state: State) => state.selected;
export const getSearch = (state: State) => state.search;
export const getSearchTotal = (state: State) => state.searchTotal;
export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
