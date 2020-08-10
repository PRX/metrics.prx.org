import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PodcastListeners } from '../models/podcast-listeners.model';
import { selectPodcastRoute } from './router.selectors';
import { PodcastListenersState, selectAllPodcastListeners } from '../podcast-listeners.reducer';

export const selectPodcastListenersState = createFeatureSelector<PodcastListenersState>('podcastListeners');

export const selectPodcastListenersLoading = createSelector(selectPodcastListenersState, (metrics: PodcastListenersState) => {
  const all = selectAllPodcastListeners(metrics);
  return all.some((m: PodcastListeners) => m.loading);
});

export const selectPodcastListenersLoaded = createSelector(selectPodcastListenersState, (metrics: PodcastListenersState) => {
  const all = selectAllPodcastListeners(metrics);
  return all.every((m: PodcastListeners) => m.loaded || m.loaded === undefined);
});

export const selectPodcastListenersError = createSelector(selectPodcastListenersState, (metrics: PodcastListenersState) => {
  const all = selectAllPodcastListeners(metrics);
  return all.filter(m => m.error);
});

export const selectRoutedPodcastListeners = createSelector(
  selectPodcastRoute,
  selectPodcastListenersState,
  (podcastId: string, metrics: PodcastListenersState): PodcastListeners => {
    const all = selectAllPodcastListeners(metrics);
    return all.find((metric: PodcastListeners) => metric.id === podcastId);
  }
);
