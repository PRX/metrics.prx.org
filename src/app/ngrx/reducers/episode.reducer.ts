import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Episode } from './models/episode.model';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<Episode> {
  // additional entities state properties
  pagesLoaded: number[];
  pagesLoading: number[];
  total: number;
  error?: any;
}

export function sortByPodcastAndPubDate(a: Episode, b: Episode) {
  return a.podcastId.localeCompare(b.podcastId) ||
    b.publishedAt.valueOf() - a.publishedAt.valueOf();
}

export const adapter: EntityAdapter<Episode> = createEntityAdapter<Episode>({
  selectId: (e: Episode) => e.guid,
  sortComparer: sortByPodcastAndPubDate
});

export const initialState: State = adapter.getInitialState({
  pagesLoaded: [],
  pagesLoading: [],
  total: 0
});

export const addToArray = function(entries: number[], value: number) {
  if (entries.indexOf(value) > -1) {
    return entries;
  } else {
    return entries.concat([value]).sort((a, b) => a - b);
  }
};

export const removeFromArray = function(entries: number[], value: number) {
  if (entries.indexOf(value) === -1) {
    return entries; // don't actually want a new array if not changed
  } else {
    return entries.filter(e => e !== value);
  }
};

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.ROUTE_PODCAST: {
      return {
        ...state,
        pagesLoaded: [],
        pagesLoading: []
      };
    }
    case ActionTypes.CASTLE_EPISODE_PAGE_LOAD: {
      return {...state, error: null, pagesLoading: addToArray(state.pagesLoading, action.payload.page)};
    }
    case ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS: {
      const { page, total, episodes } = action.payload;
      return {
        ...adapter.upsertMany(episodes.map(episode => {
          return {id: episode.guid, ...episode};
        }), state),
        pagesLoaded: addToArray(state.pagesLoaded, page),
        pagesLoading: removeFromArray(state.pagesLoading, page),
        total: page === 1 || !state.total ? total : state.total
      };
    }
    case ActionTypes.CASTLE_EPISODE_PAGE_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        pagesLoading: []
      };
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

export const getPagesLoaded = (state: State) => state.pagesLoaded;
export const getPagesLoading = (state: State) => state.pagesLoading;
export const getTotal = (state: State) => state.total;
export const getError = (state: State) => state.error;
