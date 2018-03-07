import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { EpisodeModel, getEpisodeEntities, getEpisodesLoaded, getEpisodesLoading, getEpisodesError } from '../episode.reducer';
import { selectPageRoute } from './router.selectors';

export const selectEpisodeState = createSelector(selectAppState, (state: RootState) => state.episodes);
export const selectEpisodeEntities = createSelector(selectEpisodeState, getEpisodeEntities);
export const selectEpisodes = createSelector(selectEpisodeEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});
export const selectEpisodesLoaded = createSelector(selectEpisodeState, getEpisodesLoaded);
export const selectEpisodesLoading = createSelector(selectEpisodeState, getEpisodesLoading);
export const selectEpisodesError = createSelector(selectEpisodeState, getEpisodesError);
export const selectSelectedPageEpisodes = createSelector(selectEpisodes, selectPageRoute, (episodes: EpisodeModel[], page: number) => {
  return episodes.filter(episode => episode.page === page);
});
