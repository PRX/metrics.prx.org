import { createSelector } from '@ngrx/store';
import { Episode, RouterParams, DownloadsTableModel, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './castle-episode.selectors';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { selectRoutedPodcastMetrics } from './podcast-metrics.selectors';
import { PodcastPerformanceMetricsModel } from '../podcast-performance-metrics.reducer';
import { selectRoutedPodcastPerformanceMetrics } from './podcast-performance-metrics.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { selectRoutedEpisodePageMetrics } from './episode-metrics.selectors';
import { EpisodePerformanceMetricsModel } from '../episode-performance-metrics.reducer';
import { selectRoutedEpisodePagePerformanceMetrics } from './episode-performance-metrics.selectors';
import { metricsData, getTotal } from '../../../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, neutralColor, standardColor, getColor } from '../../../shared/util/chart.util';

export const selectDownloadTablePodcastMetrics = createSelector(
  selectRouter,
  selectRoutedPodcastMetrics,
  selectRoutedPodcastPerformanceMetrics,
  (routerParams: RouterParams,
   podcastMetrics: PodcastMetricsModel,
   podcastPerformanceMetrics: PodcastPerformanceMetricsModel): DownloadsTableModel => {
    let podcastData: DownloadsTableModel;

    if (podcastMetrics && routerParams.chartType !== CHARTTYPE_EPISODES) {
      const data = metricsData(routerParams, podcastMetrics);
      if (data) {
        const totalForPeriod = getTotal(data);
        podcastData = {
          id: routerParams.podcastId,
          title: 'All Episodes',
          downloads: mapMetricsToTimeseriesData(data),
          color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor,
          totalForPeriod,
          charted: true/*routerParams.chartPodcast*/
        };
        if (podcastPerformanceMetrics) {
          if (totalForPeriod > podcastPerformanceMetrics.total) {
            podcastData.allTimeDownloads = totalForPeriod;
          } else {
            podcastData.allTimeDownloads = podcastPerformanceMetrics.total;
          }
        }
      }
    }
    return podcastData;
  }
);

export const selectDownloadTableEpisodeMetrics = createSelector(
  selectRouter,
  selectRoutedPageEpisodes,
  selectRoutedEpisodePageMetrics,
  selectRoutedEpisodePagePerformanceMetrics,
  (routerParams: RouterParams,
   episodes: Episode[],
   episodeMetrics: EpisodeMetricsModel[],
   episodePerformanceMetrics: EpisodePerformanceMetricsModel[]): DownloadsTableModel[] => {
    let episodesData: DownloadsTableModel[];

    if (episodes.length && episodeMetrics.length && episodePerformanceMetrics.length) {
      episodesData = episodes
        .filter(episode => metricsData(routerParams, episodeMetrics.find(e => e.guid === episode.guid)))
        .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
        .map((episode: Episode, idx) => {
          const metrics = episodeMetrics.find(e => e.guid === episode.guid);
          const performanceMetrics = episodePerformanceMetrics.find(e => e.guid === episode.guid);
          const data = metricsData(routerParams, metrics);
          const totalForPeriod = getTotal(data);
          const episodeTableData: DownloadsTableModel = {
            id: episode.guid,
            title: episode.title,
            publishedAt: episode.publishedAt,
            downloads: mapMetricsToTimeseriesData(data),
            color: getColor(idx),
            totalForPeriod,
            charted: true/* routerParams.episodeIds.indexOf(episode.id) >= 0 */
          };
          if (performanceMetrics) {
            if (totalForPeriod > performanceMetrics.total) {
              episodeTableData.allTimeDownloads = totalForPeriod;
            } else {
              episodeTableData.allTimeDownloads = performanceMetrics.total;
            }
          }
          return episodeTableData;
        });
    }
    return episodesData;
  }
);
