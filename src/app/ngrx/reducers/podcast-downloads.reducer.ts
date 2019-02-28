import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions';
import { PodcastDownloads } from './models/podcast-downloads.model';
import { UpdateStr } from '@ngrx/entity/src/models';

export type PodcastDownloadsState = EntityState<PodcastDownloads>;

export const adapter: EntityAdapter<PodcastDownloads> = createEntityAdapter<PodcastDownloads>();

export const initialState: EntityState<PodcastDownloads> = adapter.getInitialState();

export const {
  selectIds: selectPodcastDownloadsIds,
  selectEntities: selectPodcastDownloadsEntities,
  selectAll: selectAllPodcastDownloads,
  selectTotal: selectTotalPodcastDownloads,
} = adapter.getSelectors();

export function PodcastDownloadsReducer(state: PodcastDownloadsState = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_DOWNLOADS_LOAD: {
      const { id } = action.payload;
      const entity = selectPodcastDownloadsEntities(state)[id];
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastDownloadsEntities(state)[id],
          error: null, loading: true, loaded: false, charted: !entity || entity.charted
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_DOWNLOADS_SUCCESS: {
      const { id, downloads } = action.payload;
      const entity = selectPodcastDownloadsEntities(state)[id];
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastDownloadsEntities(state)[id],
          downloads, loading: false, loaded: true, charted: !entity || entity.charted
        }, state);
    }
    case ActionTypes.CASTLE_PODCAST_DOWNLOADS_FAILURE: {
      const { id, error } = action.payload;
      return adapter.upsertOne(
        {
          id,
          ...selectPodcastDownloadsEntities(state)[id],
          error, loading: false, loaded: true
        }, state);
    }
    case ActionTypes.CHART_TOGGLE_PODCAST: {
      const { id, charted } = action.payload;
      const podcastUpdate: UpdateStr<PodcastDownloads> = {
        id,
        changes: {
          charted
        }
      };
      return adapter.updateOne(podcastUpdate, state);
    }
    default:
      return state;
  }
}
