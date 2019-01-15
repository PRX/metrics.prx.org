import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions';
import { PodcastDownloads } from './models/podcast-downloads.model';
import { UpdateStr } from '@ngrx/entity/src/models';
import * as includes from 'array-includes';

export type PodcastDownloadsState = EntityState<PodcastDownloads>;

export const adapter: EntityAdapter<PodcastDownloads> = createEntityAdapter<PodcastDownloads>();

export const initialState: EntityState<PodcastDownloads> = adapter.getInitialState();

export function PodcastDownloadsReducer(state: PodcastDownloadsState = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_DOWNLOADS_LOAD: {
      const { id } = action.payload;
      const currentIds = <string[]>selectPodcastDownloadsIds(state);
      const charted = !includes(currentIds, id);
      const podcastUpdate: UpdateStr<PodcastDownloads> = {
        id,
        changes: {
          error: null,
          loading: true,
          loaded: false,
          ...(charted && { charted }) // Conditionally add charted as object member
        }
      };
      return adapter.upsertOne(podcastUpdate, state);
    }
    case ActionTypes.CASTLE_PODCAST_DOWNLOADS_SUCCESS: {
      const { id, metricsPropertyName, metrics } = action.payload;
      const currentIds = <string[]>selectPodcastDownloadsIds(state);
      const charted = !includes(currentIds, id);
      const podcastUpdate: UpdateStr<PodcastDownloads> = {
        id,
        changes: {
          [metricsPropertyName]: metrics,
          loading: false,
          loaded: true,
          ...(charted && { charted }) // Conditionally add charted as object member
        }
      };
      return adapter.upsertOne(podcastUpdate, state);
    }
    case ActionTypes.CASTLE_PODCAST_DOWNLOADS_FAILURE: {
      const { id, error } = action.payload;
      const podcastUpdate: UpdateStr<PodcastDownloads> = {
        id,
        changes: {
          error,
          loading: false,
          loaded: true
        }
      };
      return adapter.upsertOne(podcastUpdate, state);
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

export const {
  selectIds: selectPodcastDownloadsIds,
  selectEntities: selectPodcastDownloadsEntities,
  selectAll: selectAllPodcastDownloads,
  selectTotal: selectTotalPodcastDownloads,
} = adapter.getSelectors();
