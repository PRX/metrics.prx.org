import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { getPodcastEntities, getPodcastsLoaded, getPodcastsLoading, getPodcastsError } from '../podcast.reducer';
import { selectPodcastRoute } from './router.selectors';

export const selectPodcastState = createSelector(selectAppState, (state: RootState) => state.podcasts);
export const selectPodcastEntities = createSelector(selectPodcastState, getPodcastEntities);
export const selectPodcasts = createSelector(selectPodcastEntities, entities => {
  return Object.keys(entities).map(seriesId => entities[parseInt(seriesId, 10)]);
});
export const selectPodcastsLoaded = createSelector(selectPodcastState, getPodcastsLoaded);
export const selectPodcastsLoading = createSelector(selectPodcastState, getPodcastsLoading);
export const selectPodcastsError = createSelector(selectPodcastState, getPodcastsError);
export const selectSelectedPodcast = createSelector(selectPodcastEntities, selectPodcastRoute,
  (entities, podcastSeriesId) => entities[podcastSeriesId]);
