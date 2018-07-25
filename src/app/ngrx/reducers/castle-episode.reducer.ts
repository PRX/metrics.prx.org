import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Episode } from './models/episode.model';
import { ActionTypes, AllActions } from '../actions';

export interface State extends EntityState<Episode> {
  // additional entities state properties
}

export function sortByPodcastAndPubDate(a: Episode, b: Episode) {
  return a.podcastId.localeCompare(b.podcastId) ||
    b.publishedAt.valueOf() - a.publishedAt.valueOf();
}

export const adapter: EntityAdapter<Episode> = createEntityAdapter<Episode>({
  selectId: (e: Episode) => e.guid,
  sortComparer: sortByPodcastAndPubDate
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS: {
      return adapter.addMany(action.payload.episodes, state);
    }
    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors();

export const selectEpisodeGuids = selectIds;
export const selectEpisodeEntities = selectEntities;
export const selectAllEpisodes = selectAll;
