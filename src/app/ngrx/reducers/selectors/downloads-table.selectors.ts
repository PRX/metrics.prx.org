import { createSelector } from '@ngrx/store';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';
import { RouterModel, CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../models';
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

export interface DownloadsTableModel {
  title: string;
  publishedAt?: Date;
  color: string;
  id?: number;
  downloads: TimeseriesDatumModel[];
  totalForPeriod: number;
  allTimeDownloads?: number;
  charted: boolean;
}

export const selectDownloadTablePodcastMetrics = createSelector(
  selectRouter,
  selectSelectedPodcastMetrics,
  selectSelectedPodcastPerformanceMetrics,
  (routerState: RouterModel,
   podcastMetrics: PodcastMetricsModel,
   podcastPerformanceMetrics: PodcastPerformanceMetricsModel): DownloadsTableModel => {
    let podcastData: DownloadsTableModel;

    if (podcastMetrics &&
      routerState.chartType === CHARTTYPE_PODCAST || (routerState.chartPodcast && routerState.chartType === CHARTTYPE_STACKED)) {
      const data = metricsData(routerState, podcastMetrics);
      if (data) {
        podcastData = {
          title: 'All Episodes',
          downloads: mapMetricsToTimeseriesData(data),
          color: routerState.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor,
          totalForPeriod: getTotal(data),
          charted: routerState.chartPodcast
        };
        if (podcastPerformanceMetrics) {
          podcastData.allTimeDownloads = podcastPerformanceMetrics.total;
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
  (routerState: RouterModel,
   episodes: EpisodeModel[],
   episodeMetrics: EpisodeMetricsModel[],
   episodePerformanceMetrics: EpisodePerformanceMetricsModel[]): DownloadsTableModel[] => {
    let episodesData: DownloadsTableModel[];

    if (episodes.length && episodeMetrics.length && episodePerformanceMetrics.length) {
      episodesData = episodes
        .filter(episode => metricsData(routerState, episodeMetrics.find(e => e.id === episode.id)))
        .map(episode => {
          const metrics = episodeMetrics.find(e => e.id === episode.id);
          const performanceMetrics = episodePerformanceMetrics.find(e => e.id === episode.id);
          const data = metricsData(routerState, metrics);
          const episodeTableData: DownloadsTableModel = {
            title: episode.title,
            publishedAt: episode.publishedAt,
            downloads: mapMetricsToTimeseriesData(data),
            color: episode.color,
            id: episode.id,
            totalForPeriod: getTotal(data),
            charted: routerState.episodeIds.indexOf(episode.id) >= 0
          };
          if (performanceMetrics) {
            episodeTableData.allTimeDownloads = performanceMetrics.total;
          }
          return episodeTableData;
        }).sort((a: DownloadsTableModel, b: DownloadsTableModel) => {
          return b.publishedAt.valueOf() - a.publishedAt.valueOf();
        });
    }
    return episodesData;
  }
);
