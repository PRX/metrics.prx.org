import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { EpisodeModel } from '../episode.reducer';
import { getRecentEpisodeEntities, getRecentEpisodeLoaded,
  getRecentEpisodeLoading, getRecentEpisodeError } from '../recent-episode.reducer';
import { selectRouter, selectPodcastRoute } from './router.selectors';
import { selectEpisodeMetrics } from './episode-metrics.selectors';
import { EpisodePerformanceMetricsModel } from '../episode-performance-metrics.reducer';
import { selectEpisodePerformanceMetricsEntities } from './episode-performance-metrics.selectors';
import { metricsData, getTotal } from '../../../shared/util/metrics.util';
import { beginningOfTodayUTC } from '../../../shared/util/date/date.util';

export const selectRecentEpisodeState = createSelector(selectAppState, (state: RootState) => state.recentEpisodes);
export const selectRecentEpisodeEntities = createSelector(selectRecentEpisodeState, getRecentEpisodeEntities);
export const selectRecentEpisode = createSelector(selectRecentEpisodeEntities, selectPodcastRoute, (entities, seriesId): EpisodeModel => {
  return entities[seriesId];
});
export const selectRecentEpisodeLoaded = createSelector(selectRecentEpisodeState, getRecentEpisodeLoaded);
export const selectRecentEpisodeLoading = createSelector(selectRecentEpisodeState, getRecentEpisodeLoading);
export const selectRecentEpisodeError = createSelector(selectRecentEpisodeState, getRecentEpisodeError);

export const selectRecentEpisodeMetrics = createSelector(
  selectRecentEpisode, selectEpisodeMetrics, (episode, metrics) => {
    return episode && metrics.find(m => m.id === episode.id);
  }
);

export const selectRecentEpisodePerformanceMetrics = createSelector(
  selectRecentEpisode, selectEpisodePerformanceMetricsEntities, selectRouter, selectRecentEpisodeMetrics,
  (episode: EpisodeModel, entities, routerState, metrics): EpisodePerformanceMetricsModel => {
    if (episode && entities[episode.id]) {
      // if we have full metrics data on the recent episode, check the today and all time total values and reconcile
      if (metrics) {
        // this whole bit can't reconcile totals if the app was loaded from non default route without recent episode metrics data
        let totalForToday = entities[episode.id].today;
        // if recent episode is not on routed episode page, check for episode dailyDownloads and total
        const totalForRange = getTotal(metricsData(routerState, metrics)) || (metrics.dailyDownloads && getTotal(metrics.dailyDownloads));

        // today's total doesn't update until day after release, so attempt to get it from the daily downloads
        // (If app was loaded from non default url, we probably won't have dailyDownloads for today, an edge case I can live with.
        // _could_ also total hourlies from today if they are refreshing the page from that route, but this is not doing that.)
        if (metrics.dailyDownloads &&
          new Date(metrics.dailyDownloads[metrics.dailyDownloads.length - 1][0]).valueOf() >= beginningOfTodayUTC().valueOf()) {
          totalForToday = metrics.dailyDownloads[metrics.dailyDownloads.length - 1][1];
        }

        if (totalForRange > entities[episode.id].total || totalForToday > entities[episode.id].today) {
          return {
            ...entities[episode.id],
            total: Math.max(totalForRange, entities[episode.id].total),
            today: totalForToday
          };
        }
      }
      return entities[episode.id];
    }
  });
