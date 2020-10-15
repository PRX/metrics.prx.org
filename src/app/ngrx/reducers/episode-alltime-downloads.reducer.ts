import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { EpisodeAllTimeDownloads } from './models/';
import * as downloadActions from '../actions/castle-downloads.action.creator';

export type State = EntityState<EpisodeAllTimeDownloads>;

export const adapter: EntityAdapter<EpisodeAllTimeDownloads> = createEntityAdapter<EpisodeAllTimeDownloads>();

export const initialState: State = adapter.getInitialState({});

export const {
  selectIds: selectEpisodeAllTimeDownloadsGuids,
  selectEntities: selectEpisodeAllTimeDownloadsEntities,
  selectAll: selectAllEpisodeAllTimeDownloads
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(downloadActions.CastleEpisodeAllTimeDownloadsLoad, (state, action) => {
    const { guid, podcastId } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeAllTimeDownloadsEntities(state)[guid],
        guid,
        podcastId,
        error: null,
        loading: true,
        loaded: false
      },
      state
    );
  }),
  on(downloadActions.CastleEpisodeAllTimeDownloadsSuccess, (state, action) => {
    const { guid, podcastId, total } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeAllTimeDownloadsEntities(state)[guid],
        guid,
        podcastId,
        allTimeDownloads: total,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(downloadActions.CastleEpisodeAllTimeDownloadsFailure, (state, action) => {
    const { guid, podcastId, error } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeAllTimeDownloadsEntities(state)[guid],
        guid,
        podcastId,
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
