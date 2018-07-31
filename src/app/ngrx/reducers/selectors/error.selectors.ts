import { createSelector } from '@ngrx/store';
import { selectEpisodeError } from './castle-episode.selectors';
import { selectPodcastError } from './castle-podcast.selectors';
import { selectEpisodeMetricsError } from './episode-metrics.selectors';
import { selectPodcastMetricsError } from './podcast-metrics.selectors';
import { errorType } from './error.type';

export const selectCmsErrors = createSelector(selectPodcastError, selectEpisodeError, (podcastError, episodeError) => {
  const errors = [];
  if (podcastError) {
    errors.push(`${errorType(podcastError.code)} error occurred while requesting podcast series`);
  }
  if (episodeError) {
    errors.push(`${errorType(episodeError.code)} error occurred while requesting episode data`);
  }
  return errors;
});
export const selectCastleErrors = createSelector(selectPodcastMetricsError, selectEpisodeMetricsError,
  (podcasts, episodes) => podcasts.concat(episodes));
export const selectErrors = createSelector(selectCmsErrors, selectCastleErrors, (cms, castle) => cms.concat(castle));
