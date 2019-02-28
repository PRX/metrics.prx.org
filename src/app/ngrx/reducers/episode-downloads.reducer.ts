import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions';
import { Episode, EpisodeDownloads } from './models';

export type State = EntityState<EpisodeDownloads>;

export const adapter: EntityAdapter<EpisodeDownloads> = createEntityAdapter<EpisodeDownloads>();

export const initialState: EntityState<EpisodeDownloads> = adapter.getInitialState();

export const {
  selectIds: selectEpisodeDownloadsGuids,
  selectEntities: selectEpisodeDownloadsEntities,
  selectAll: selectAllEpisodeDownloads
} = adapter.getSelectors();

export function reducer(state: State = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS: {
      // sets loaded to false on entry when episode page is loaded expecting that downloads will also be loaded
      // (prevents loaded selector from showing prematurely when downloads load call has momentarily not yet been made)
      const { episodes } = action.payload;
      return adapter.addMany(episodes.map((episode: Episode) => {
        const { guid, podcastId, page } = episode;
        return {id: episode.guid, changes: { guid, podcastId, page, loaded: false}};
      }), state);
    }

    case ActionTypes.CASTLE_EPISODE_DOWNLOADS_LOAD: {
      const { guid, podcastId, page } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeDownloadsEntities(state)[guid],
          guid, podcastId, page, error: null, loading: true, loaded: false
        },
        state);
    }
    case ActionTypes.CASTLE_EPISODE_DOWNLOADS_SUCCESS: {
      const { guid, podcastId, page, downloads } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeDownloadsEntities(state)[guid],
          guid, podcastId, page, downloads, charted: true, loading: false, loaded: true
        },
        state);
    }
    case ActionTypes.CASTLE_EPISODE_DOWNLOADS_FAILURE: {
      const { guid, podcastId, page, error } = action.payload;
      return adapter.upsertOne(
        {
          id: guid,
          ...selectEpisodeDownloadsEntities(state)[guid],
          guid, podcastId, page, error, loading: false, loaded: false
        },
        state);
    }

    case ActionTypes.CHART_SINGLE_EPISODE: {
      const allGuids = <string[]>selectEpisodeDownloadsGuids(state);
      return adapter.upsertMany(allGuids.map(guid =>
          ({
            id: guid,
            guid,
            ...selectEpisodeDownloadsEntities(state)[guid],
            charted: guid === action.payload.guid})),
          state);
    }
    case ActionTypes.CHART_TOGGLE_EPISODE: {
      const { guid, charted } = action.payload;
      return adapter.updateOne(
        {
          id: guid,
          changes: {
            charted
          }
        },
        state);
    }
    default:
      return state;
  }
}
