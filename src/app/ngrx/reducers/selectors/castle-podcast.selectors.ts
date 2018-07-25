import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcast from '../castle-podcast.reducer';
import { selectPodcastRoute } from './router.selectors';

export const selectPodcastState = createFeatureSelector<fromPodcast.State>('podcast');

export const selectPodcastIds = createSelector(
  selectPodcastState,
  fromPodcast.selectPodcastIds
);
export const selectPodcastEntities = createSelector(
  selectPodcastState,
  fromPodcast.selectPodcastEntities
);
export const selectAllPodcasts = createSelector(
  selectPodcastState,
  fromPodcast.selectAllPodcasts
);

export const selectRoutedPodcast = createSelector(selectPodcastEntities, selectPodcastRoute,
  (entities, podcastId) => entities[podcastId]);
