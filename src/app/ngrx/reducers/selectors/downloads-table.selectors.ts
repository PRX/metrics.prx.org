import { createSelector } from '@ngrx/store';
import { Episode, RouterParams, PodcastAllTimeDownloads, EpisodeAllTimeDownloads, DownloadsTableModel,
  CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { PodcastDownloads } from "../models/podcast-downloads.model";
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedPodcastAllTimeDownloads } from './podcast-alltime-downloads.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { selectRoutedEpisodePageMetrics } from './episode-metrics.selectors';
import { selectRoutedPageEpisodeAllTimeDownloads } from './episode-alltime-downloads.selectors';
import { metricsData, getTotal } from '../../../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, neutralColor, standardColor, getColor } from '../../../shared/util/chart.util';

export const selectDownloadTablePodcastDownloads = createSelector(
  selectRouter,
  selectRoutedPodcastDownloads,
  selectRoutedPodcastAllTimeDownloads,
  (routerParams: RouterParams,
   PodcastDownloads: PodcastDownloads,
   podcastDownloads: PodcastAllTimeDownloads): DownloadsTableModel => {
    let podcastData: DownloadsTableModel;

    if (PodcastDownloads && routerParams.chartType !== CHARTTYPE_EPISODES) {
      const data = metricsData(routerParams, PodcastDownloads);
      if (data) {
        const totalForPeriod = getTotal(data);
        podcastData = {
          id: routerParams.podcastId,
          title: 'All Episodes',
          downloads: mapMetricsToTimeseriesData(data),
          color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor,
          totalForPeriod,
          charted: PodcastDownloads.charted
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
  selectRoutedPageEpisodeAllTimeDownloads,
  (routerParams: RouterParams,
   episodes: Episode[],
   episodeMetrics: EpisodeMetricsModel[],
   episodeDownloads: EpisodeAllTimeDownloads[]): DownloadsTableModel[] => {
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
