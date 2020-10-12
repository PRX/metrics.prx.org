import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Podcast } from './models/podcast.model';
import * as catalogActions from '../actions/castle-catalog.action.creator';

export interface State extends EntityState<Podcast> {
  // additional entities state properties
  error?: any;
}

export function sortByTitle(a: Podcast, b: Podcast) {
  return a.title.localeCompare(b.title);
}

export const adapter: EntityAdapter<Podcast> = createEntityAdapter<Podcast>({
  sortComparer: sortByTitle
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const _reducer = createReducer(
  initialState,
  on(catalogActions.CastlePodcastPageLoad, (state, action) => {
    return {
      ...state,
      error: null
    };
  }),
  on(catalogActions.CastlePodcastPageSuccess, (state, action) => {
    return adapter.upsertMany(action.podcasts, state);
  }),
  on(catalogActions.CastlePodcastPageFailure, (state, action) => {
    return { ...state, error: action.error };
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}

export const { selectIds: selectPodcastIds, selectEntities: selectPodcastEntities, selectAll: selectAllPodcasts } = adapter.getSelectors();

export const getError = (state: State) => state.error;
