import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as downloadActions from '../actions/castle-downloads.action.creator';
import * as chartActions from '../actions/chart-toggle.action.creator';
import { PodcastDownloads } from './models/podcast-downloads.model';

export type PodcastDownloadsState = EntityState<PodcastDownloads>;

export const adapter: EntityAdapter<PodcastDownloads> = createEntityAdapter<PodcastDownloads>();

export const initialState: EntityState<PodcastDownloads> = adapter.getInitialState();

export const {
  selectIds: selectPodcastDownloadsIds,
  selectEntities: selectPodcastDownloadsEntities,
  selectAll: selectAllPodcastDownloads,
  selectTotal: selectTotalPodcastDownloads
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(downloadActions.CastlePodcastDownloadsLoad, (state, action) => {
    const { id } = action;
    const entity = selectPodcastDownloadsEntities(state)[id];
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastDownloadsEntities(state)[id],
        error: null,
        loading: true,
        loaded: false,
        charted: !entity || entity.charted
      },
      state
    );
  }),
  on(downloadActions.CastlePodcastDownloadsSuccess, (state, action) => {
    const { id, downloads } = action;
    const entity = selectPodcastDownloadsEntities(state)[id];
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastDownloadsEntities(state)[id],
        downloads,
        loading: false,
        loaded: true,
        charted: !entity || entity.charted
      },
      state
    );
  }),
  on(downloadActions.CastlePodcastDownloadsFailure, (state, action) => {
    const { id, error } = action;
    return adapter.upsertOne(
      {
        id,
        ...selectPodcastDownloadsEntities(state)[id],
        error,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(chartActions.ChartTogglePodcast, (state, action) => {
    const { id, charted } = action;
    return adapter.updateOne(
      {
        id,
        changes: {
          charted
        }
      },
      state
    );
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}
