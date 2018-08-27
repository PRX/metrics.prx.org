import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromPodcastGroupCharted from '../podcast-group-charted.reducer';
import { selectPodcastRoute } from './router.selectors';
import { PodcastGroupCharted } from '../models';

export const selectPodcastGroupChartedState = createFeatureSelector<fromPodcastGroupCharted.State>('podcastGroupCharted');

export const selectPodcastGroupChartedIds = createSelector(
  selectPodcastGroupChartedState,
  fromPodcastGroupCharted.selectPodcastGroupKeys
);
export const selectPodcastGroupChartedEntities = createSelector(
  selectPodcastGroupChartedState,
  fromPodcastGroupCharted.selectPodcastGroupChartedEntities
);
export const selectAllPodcastGroupCharted = createSelector(
  selectPodcastGroupChartedState,
  fromPodcastGroupCharted.selectAllPodcastGroupCharted
);

export const selectRoutedPodcastGroupCharted = createSelector(
  selectPodcastRoute,
  selectAllPodcastGroupCharted,
  (podcastId: string, groupsCharted: PodcastGroupCharted[]) => {
    return groupsCharted.filter(group => group.podcastId === podcastId);
  }
);
