import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as downloadActions from '../actions/castle-downloads.action.creator';
import { PodcastListeners } from './models/podcast-listeners.model';

export type PodcastListenersState = EntityState<PodcastListeners>;

export const adapter: EntityAdapter<PodcastListeners> = createEntityAdapter<PodcastListeners>();

export const initialState: EntityState<PodcastListeners> = adapter.getInitialState();

export const {
  selectIds: selectPodcastListenersIds,
  selectEntities: selectPodcastListenersEntities,
  selectAll: selectAllPodcastListeners,
  selectTotal: selectTotalPodcastListeners
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(downloadActions.CastlePodcastListenersLoad, (state, action) => {
    const { id } = action;
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastListenersEntities(state)[id],
        error: null,
        loading: true,
        loaded: false
      },
      state
    );
  }),
  on(downloadActions.CastlePodcastListenersSuccess, (state, action) => {
    const { id, listeners } = action;
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastListenersEntities(state)[id],
        listeners,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(downloadActions.CastlePodcastListenersFailure, (state, action) => {
    const { id, error } = action;
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastListenersEntities(state)[id],
        error,
        loading: false,
        loaded: true
      },
      state
    );
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}
