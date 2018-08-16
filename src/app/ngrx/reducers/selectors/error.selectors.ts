import { createSelector } from '@ngrx/store';
import { selectEpisodeError } from './episode.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeMetricsError } from './episode-metrics.selectors';
import { selectPodcastMetricsError } from './podcast-metrics.selectors';
import { errorType } from './error.type';

export const selectCatalogErrors = createSelector(selectPodcastError, selectEpisodeError, (podcastError, episodeError) => {
  const errors = [];
  if (podcastError) {
    errors.push(`${errorType(podcastError.code)} error occurred while requesting list of podcasts`);
  }
  if (episodeError) {
    errors.push(`${errorType(episodeError.code)} error occurred while requesting list of episodes`);
  }
  return errors;
});
export const selectMetricsErrors = createSelector(selectPodcastMetricsError, selectEpisodeMetricsError,
  (podcasts, episodes) => podcasts.concat(episodes));
export const selectErrors = createSelector(selectCatalogErrors, selectMetricsErrors, (catalog, metrics) => catalog.concat(metrics));
