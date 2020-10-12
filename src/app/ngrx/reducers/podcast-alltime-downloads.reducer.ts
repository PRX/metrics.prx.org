import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PodcastAllTimeDownloads } from './models/';
import * as downloadActions from '../actions/castle-downloads.action.creator';

export type State = EntityState<PodcastAllTimeDownloads>;

export const adapter: EntityAdapter<PodcastAllTimeDownloads> = createEntityAdapter<PodcastAllTimeDownloads>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds: selectPodcastAllTimeDownloadsIds,
  selectEntities: selectPodcastAllTimeDownloadsEntities,
  selectAll: selectAllPodcastAllTimeDownloads
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(downloadActions.CastlePodcastAllTimeDownloadsLoad, (state, action) => {
    const { id } = action;
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastAllTimeDownloadsEntities(state)[id],
        error: null,
        loading: true,
        loaded: false
      },
      state
    );
  }),
  on(downloadActions.CastlePodcastAllTimeDownloadsSuccess, (state, action) => {
    const { id, total } = action;
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastAllTimeDownloadsEntities(state)[id],
        allTimeDownloads: total,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(downloadActions.CastlePodcastAllTimeDownloadsFailure, (state, action) => {
    const { id, error } = action;
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastAllTimeDownloadsEntities(state)[id],
        error,
        loading: false,
        loaded: false
      },
      state
    );
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}
