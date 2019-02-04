import { createSelector } from '@ngrx/store';
import { Episode, EpisodeDownloads, RouterParams, PodcastAllTimeDownloads, EpisodeAllTimeDownloads, DownloadsTableModel,
  CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { PodcastDownloads } from '../models/podcast-downloads.model';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedPodcastAllTimeDownloads } from './podcast-alltime-downloads.selectors';
import { selectRoutedEpisodePageDownloads } from './episode-downloads.selectors';
import { selectRoutedPageEpisodeAllTimeDownloads } from './episode-alltime-downloads.selectors';
import { getTotal } from '../../../shared/util/metrics.util';
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
      const data = PodcastDownloads.downloads;
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
  selectRoutedPageEpisodes,
  selectRoutedEpisodePageDownloads,
  selectRoutedPageEpisodeAllTimeDownloads,
  (episodes: Episode[],
   episodeDownloads: EpisodeDownloads[],
   episodeAllTimeDownloads: EpisodeAllTimeDownloads[]): DownloadsTableModel[] => {
    let episodesData: DownloadsTableModel[];

    if (episodes.length && episodeDownloads.length && episodeAllTimeDownloads.length) {
      episodesData = episodes
        .filter(episode => {
          const entity = episodeDownloads.find(e => e.guid === episode.guid);
          return entity && entity.downloads;
        })
        .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
        .map((episode: Episode, idx) => {
          const entity = episodeDownloads.find(e => e.guid === episode.guid);
          const allTimeDownloads = episodeAllTimeDownloads.find(e => e.guid === episode.guid);
          const downloads = entity.downloads;
          const totalForPeriod = getTotal(downloads);
          const episodeTableData: DownloadsTableModel = {
            id: episode.guid,
            title: episode.title,
            publishedAt: episode.publishedAt,
            downloads: mapMetricsToTimeseriesData(downloads),
            color: getColor(idx),
            totalForPeriod,
            charted: entity.charted
          };
          if (allTimeDownloads) {
            if (totalForPeriod > allTimeDownloads.allTimeDownloads) {
              episodeTableData.allTimeDownloads = totalForPeriod;
            } else {
              episodeTableData.allTimeDownloads = allTimeDownloads.allTimeDownloads;
            }
          }
          return episodeTableData;
        });
    }
    return episodesData;
  }
);
