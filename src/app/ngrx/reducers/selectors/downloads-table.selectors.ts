import { createSelector } from '@ngrx/store';
import { Episode, RouterParams, PodcastDownloads, EpisodeDownloads, DownloadsTableModel, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { selectRoutedPodcastMetrics } from './podcast-metrics.selectors';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { selectRoutedEpisodePageMetrics } from './episode-metrics.selectors';
import { selectRoutedPageEpisodeDownloads } from './episode-downloads.selectors';
import { metricsData, getTotal } from '../../../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, neutralColor, standardColor, getColor } from '../../../shared/util/chart.util';

export const selectDownloadTablePodcastMetrics = createSelector(
  selectRouter,
  selectRoutedPodcastMetrics,
  selectRoutedPodcastDownloads,
  (routerParams: RouterParams,
   podcastMetrics: PodcastMetricsModel,
   podcastDownloads: PodcastDownloads): DownloadsTableModel => {
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
          charted: podcastMetrics.charted
        };
        if (podcastDownloads) {
          if (totalForPeriod > podcastDownloads.allTimeDownloads) {
            podcastData.allTimeDownloads = totalForPeriod;
          } else {
            podcastData.allTimeDownloads = podcastDownloads.allTimeDownloads;
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
  selectRoutedPageEpisodeDownloads,
  (routerParams: RouterParams,
   episodes: Episode[],
   episodeMetrics: EpisodeMetricsModel[],
   episodeDownloads: EpisodeDownloads[]): DownloadsTableModel[] => {
    let episodesData: DownloadsTableModel[];

    if (episodes.length && episodeMetrics.length && episodeDownloads.length) {
      episodesData = episodes
        .filter(episode => metricsData(routerParams, episodeMetrics.find(e => e.guid === episode.guid)))
        .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
        .map((episode: Episode, idx) => {
          const metrics = episodeMetrics.find(e => e.guid === episode.guid);
          const downloads = episodeDownloads.find(e => e.guid === episode.guid);
          const data = metricsData(routerParams, metrics);
          const totalForPeriod = getTotal(data);
          const episodeTableData: DownloadsTableModel = {
            id: episode.guid,
            title: episode.title,
            publishedAt: episode.publishedAt,
            downloads: mapMetricsToTimeseriesData(data),
            color: getColor(idx),
            totalForPeriod,
            charted: metrics.charted
          };
          if (downloads) {
            if (totalForPeriod > downloads.allTimeDownloads) {
              episodeTableData.allTimeDownloads = totalForPeriod;
            } else {
              episodeTableData.allTimeDownloads = downloads.allTimeDownloads;
            }
          }
          return episodeTableData;
        });
    }
    return episodesData;
  }
);
