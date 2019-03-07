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
          return {id: episode.guid, ...episode};
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
    // HONESTLY, these two CHART_ actions here and applying this to paged downloads feels like a bad idea
    // Paged downloads was never meant to be combined with selected episodes
    // Selected episodes were to apply to the drop date chart
    // So these only affect selected episodes if there are already selected episodes
    case ActionTypes.CHART_TOGGLE_EPISODE: {
      if (state.selected) {
        const { guid, charted } = action.payload;
        let selected = state.selected;
        if (charted && state.selected.indexOf(guid) === -1) {
          selected = [...state.selected, guid];
        } else if (!charted && state.selected.indexOf(guid) > -1) {
          selected = state.selected.filter(g => g !== guid);
        }
        return {
          ...state,
          selected
        };
      } else {
        return state;
      }
    }
    case ActionTypes.CHART_SINGLE_EPISODE: {
      // only selecting this episode if selected episodes is already set, BUT only selecting SINGLE_EPISODE
      if (state.selected && state.selected.length) {
        const { guid } = action.payload;
        return {
          ...state,
          selected: [guid]
        };
      } else {
        return state;
      }
    }
    default: {
      return state;
    }
  }
}

export const {
  selectIds: selectEpisodeGuids,
  selectEntities: selectEpisodeEntities,
  selectAll: selectAllEpisodes,
} = adapter.getSelectors();

export const getTotal = (state: State) => state.total;
export const getPage = (state: State) => state.page;
export const getSelected = (state: State) => state.selected;
export const getSearch = (state: State) => state.search;
export const getSearchTotal = (state: State) => state.searchTotal;
export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
