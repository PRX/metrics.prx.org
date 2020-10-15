import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Episode } from './models/episode.model';
import * as catalogActions from '../actions/castle-catalog.action.creator';
import * as routeActions from '../actions/router.action.creator';

export interface State extends EntityState<Episode> {
  // additional entities state properties
  pagesLoaded: number[];
  pagesLoading: number[];
  total: number;
  error?: any;
}

export function sortByPodcastAndPubDate(a: Episode, b: Episode) {
  return a.podcastId.localeCompare(b.podcastId) || b.publishedAt.valueOf() - a.publishedAt.valueOf();
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

export const addToArray = function (entries: number[], value: number) {
  if (entries.indexOf(value) > -1) {
    return entries;
  } else {
    return entries.concat([value]).sort((a, b) => a - b);
  }
};

export const removeFromArray = function (entries: number[], value: number) {
  if (entries.indexOf(value) === -1) {
    return entries; // don't actually want a new array if not changed
  } else {
    return entries.filter(e => e !== value);
  }
};

const _reducer = createReducer(
  initialState,
  on(routeActions.RoutePodcast, (state, action) => {
    return {
      ...state,
      pagesLoaded: [],
      pagesLoading: []
    };
  }),
  on(catalogActions.CastleEpisodePageLoad, (state, action) => {
    return { ...state, error: null, pagesLoading: addToArray(state.pagesLoading, action.page) };
  }),
  on(catalogActions.CastleEpisodePageSuccess, (state, action) => {
    const { page, total, episodes } = action;
    return {
      ...adapter.upsertMany(episodes, state),
      pagesLoaded: addToArray(state.pagesLoaded, page),
      pagesLoading: removeFromArray(state.pagesLoading, page),
      total: page === 1 || !state.total ? total : state.total
    };
  }),
  on(catalogActions.CastleEpisodePageFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      pagesLoading: []
    };
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}

export const {
  selectIds: selectEpisodeGuids,
  selectEntities: selectEpisodeEntities,
  selectAll: selectAllEpisodes
} = adapter.getSelectors();

export const getPagesLoaded = (state: State) => state.pagesLoaded;
export const getPagesLoading = (state: State) => state.pagesLoading;
export const getTotal = (state: State) => state.total;
export const getError = (state: State) => state.error;
