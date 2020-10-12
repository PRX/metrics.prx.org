import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as catalogActions from '../actions/castle-catalog.action.creator';
import * as chartActions from '../actions/chart-toggle.action.creator';
import * as downloadActions from '../actions/castle-downloads.action.creator';
import { Episode, EpisodeDownloads } from './models';

export type State = EntityState<EpisodeDownloads>;

export const adapter: EntityAdapter<EpisodeDownloads> = createEntityAdapter<EpisodeDownloads>();

export const initialState: EntityState<EpisodeDownloads> = adapter.getInitialState();

export const {
  selectIds: selectEpisodeDownloadsGuids,
  selectEntities: selectEpisodeDownloadsEntities,
  selectAll: selectAllEpisodeDownloads
} = adapter.getSelectors();

const _reducer = createReducer(
  initialState,
  on(catalogActions.CastleEpisodePageSuccess, (state, action) => {
    // sets loaded to false on entry when episode page is loaded expecting that downloads will also be loaded
    // (prevents loaded selector from showing prematurely when downloads load call has momentarily not yet been made)
    const { episodes } = action;
    return adapter.addMany(
      episodes.map((episode: Episode) => {
        const { guid, podcastId, page } = episode;
        return { id: guid, guid, podcastId, page, loaded: false };
      }),
      state
    );
  }),
  on(downloadActions.CastleEpisodeDownloadsLoad, (state, action) => {
    const { guid, podcastId, page } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeDownloadsEntities(state)[guid],
        guid,
        podcastId,
        page,
        error: null,
        loading: true,
        loaded: false
      },
      state
    );
  }),
  on(downloadActions.CastleEpisodeDownloadsSuccess, (state, action) => {
    const { guid, podcastId, page, downloads } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeDownloadsEntities(state)[guid],
        guid,
        podcastId,
        page,
        downloads,
        charted: true,
        loading: false,
        loaded: true
      },
      state
    );
  }),
  on(downloadActions.CastleEpisodeDownloadsFailure, (state, action) => {
    const { guid, podcastId, page, error } = action;
    return adapter.upsertOne(
      {
        id: guid,
        ...selectEpisodeDownloadsEntities(state)[guid],
        guid,
        podcastId,
        page,
        error,
        loading: false,
        loaded: false
      },
      state
    );
  }),
  on(chartActions.ChartSingleEpisode, (state, action) => {
    const allGuids = <string[]>selectEpisodeDownloadsGuids(state);
    return adapter.upsertMany(
      allGuids.map(guid => ({
        id: guid,
        guid,
        ...selectEpisodeDownloadsEntities(state)[guid],
        charted: guid === action.guid
      })),
      state
    );
  }),
  on(chartActions.ChartToggleEpisode, (state, action) => {
    const { guid, charted } = action;
    return adapter.updateOne(
      {
        id: guid,
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
