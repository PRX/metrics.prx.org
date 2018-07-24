import { createSelector } from '@ngrx/store';
import { RouterParams, DownloadsTableModel, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { selectRouter } from './router.selectors';
import { EpisodeModel } from '../episode.reducer';
import { selectSelectedPageEpisodes } from './episode.selectors';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { selectSelectedPodcastMetrics } from './podcast-metrics.selectors';
import { PodcastPerformanceMetricsModel } from '../podcast-performance-metrics.reducer';
import { selectSelectedPodcastPerformanceMetrics } from './podcast-performance-metrics.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { selectEpisodePageMetrics } from './episode-metrics.selectors';
import { EpisodePerformanceMetricsModel } from '../episode-performance-metrics.reducer';
import { selectEpisodePagePerformanceMetrics } from './episode-performance-metrics.selectors';
import { metricsData, getTotal } from '../../../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, neutralColor, standardColor } from '../../../shared/util/chart.util';

export const selectDownloadTablePodcastMetrics = createSelector(
  selectRouter,
  selectSelectedPodcastMetrics,
  selectSelectedPodcastPerformanceMetrics,
  (routerParams: RouterParams,
   podcastMetrics: PodcastMetricsModel,
   podcastPerformanceMetrics: PodcastPerformanceMetricsModel): DownloadsTableModel => {
    let podcastData: DownloadsTableModel;

    if (podcastMetrics && routerParams.chartType !== CHARTTYPE_EPISODES) {
      const data = metricsData(routerParams, podcastMetrics);
      if (data) {
        const totalForPeriod = getTotal(data);
        podcastData = {
          title: 'All Episodes',
          downloads: mapMetricsToTimeseriesData(data),
          color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor,
          totalForPeriod,
          charted: routerParams.chartPodcast
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
  selectSelectedPageEpisodes,
  selectEpisodePageMetrics,
  selectEpisodePagePerformanceMetrics,
  (routerParams: RouterParams,
   episodes: EpisodeModel[],
   episodeMetrics: EpisodeMetricsModel[],
   episodePerformanceMetrics: EpisodePerformanceMetricsModel[]): DownloadsTableModel[] => {
    let episodesData: DownloadsTableModel[];

    if (episodes.length && episodeMetrics.length && episodePerformanceMetrics.length) {
      episodesData = episodes
        .filter(episode => metricsData(routerParams, episodeMetrics.find(e => e.id === episode.id)))
        .map(episode => {
          const metrics = episodeMetrics.find(e => e.id === episode.id);
          const performanceMetrics = episodePerformanceMetrics.find(e => e.id === episode.id);
          const data = metricsData(routerParams, metrics);
          const totalForPeriod = getTotal(data);
          const episodeTableData: DownloadsTableModel = {
            title: episode.title,
            publishedAt: episode.publishedAt,
            downloads: mapMetricsToTimeseriesData(data),
            color: episode.color,
            id: episode.id,
            totalForPeriod,
            charted: routerParams.episodeIds.indexOf(episode.id) >= 0
          };
          if (performanceMetrics) {
            if (totalForPeriod > performanceMetrics.total) {
              episodeTableData.allTimeDownloads = totalForPeriod;
            } else {
              episodeTableData.allTimeDownloads = performanceMetrics.total;
            }
          }
          return episodeTableData;
        }).sort((a: DownloadsTableModel, b: DownloadsTableModel) => {
          return b.publishedAt.valueOf() - a.publishedAt.valueOf();
        });
    }
    return episodesData;
  }
);
