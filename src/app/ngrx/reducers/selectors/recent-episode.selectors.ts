import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { EpisodeModel } from '../episode.reducer';
import { getRecentEpisodeEntities, getRecentEpisodeLoaded,
  getRecentEpisodeLoading, getRecentEpisodeError } from '../recent-episode.reducer';
import { selectPodcastRoute } from './router.selectors';

export const selectRecentEpisodeState = createSelector(selectAppState, (state: RootState) => state.recentEpisodes);
export const selectRecentEpisodeEntities = createSelector(selectRecentEpisodeState, getRecentEpisodeEntities);
export const selectRecentEpisode = createSelector(selectRecentEpisodeEntities, selectPodcastRoute, (entities, seriesId): EpisodeModel => {
  return entities[seriesId];
});
export const selectRecentEpisodeLoaded = createSelector(selectRecentEpisodeState, getRecentEpisodeLoaded);
export const selectRecentEpisodeLoading = createSelector(selectRecentEpisodeState, getRecentEpisodeLoading);
export const selectRecentEpisodeError = createSelector(selectRecentEpisodeState, getRecentEpisodeError);
