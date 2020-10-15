import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as downloadActions from '../actions/castle-downloads.action.creator';
import { EpisodeDropday } from './models';

export type State = EntityState<EpisodeDropday>;

export const adapter: EntityAdapter<EpisodeDropday> = createEntityAdapter<EpisodeDropday>();

export const initialState: EntityState<EpisodeDropday> = adapter.getInitialState();

export const {
  selectIds: selectEpisodeDropdayGuids,
  selectEntities: selectEpisodeDropdayEntities,
  selectAll: selectAllEpisodeDropday
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(downloadActions.CastleEpisodeDropdayLoad, (state, action) => {
    const { guid, title, podcastId, publishedAt, interval } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeDropdayEntities(state)[guid],
        guid,
        title,
        podcastId,
        publishedAt,
        interval,
        error: null,
        loading: true,
        loaded: false
      },
      state
    );
  }),
  on(downloadActions.CastleEpisodeDropdaySuccess, (state, action) => {
    const { guid, title, podcastId, publishedAt, interval, downloads } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeDropdayEntities(state)[guid],
        guid,
        title,
        podcastId,
        publishedAt,
        interval,
        downloads,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(downloadActions.CastleEpisodeDropdayFailure, (state, action) => {
    const { guid, title, podcastId, publishedAt, interval, error } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeDropdayEntities(state)[guid],
        guid,
        title,
        podcastId,
        publishedAt,
        interval,
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
