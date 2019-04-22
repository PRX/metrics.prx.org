import { createSelector } from '@ngrx/store';
import { Episode, EpisodeDownloads, RouterParams, PodcastAllTimeDownloads, EpisodeAllTimeDownloads,
  DownloadsTableModel, DownloadsTableIntervalModel,
  CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { selectSelectedEpisodeGuids } from './episode-select.selectors';
import { PodcastDownloads } from '../models/podcast-downloads.model';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedPodcastAllTimeDownloads } from './podcast-alltime-downloads.selectors';
import { selectRoutedEpisodePageDownloads } from './episode-downloads.selectors';
import { selectRoutedPageEpisodeAllTimeDownloads } from './episode-alltime-downloads.selectors';
import { getTotal } from '@app/shared/util/metrics.util';
import { mapMetricsToTimeseriesData, neutralColor, standardColor, getColor } from '@app/shared/util/chart.util';
import { formatDateForInterval } from '@app/shared/util/date/date.util';

export const selectDownloadTablePodcastDownloads = createSelector(
  selectRouter,
  selectRoutedPodcastDownloads,
  selectRoutedPodcastAllTimeDownloads,
  (routerParams: RouterParams,
   podcastDownloads: PodcastDownloads,
   podcastAllTimeDownloads: PodcastAllTimeDownloads): DownloadsTableModel => {
    let podcastData: DownloadsTableModel;

    if (podcastDownloads && routerParams.chartType !== CHARTTYPE_EPISODES && podcastDownloads.downloads) {
      const totalForPeriod = getTotal(podcastDownloads.downloads);
      podcastData = {
        id: routerParams.podcastId,
        title: 'All Episodes',
        color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor,
        totalForPeriod,
        charted: podcastDownloads.charted
      };
      if (podcastAllTimeDownloads) {
        if (totalForPeriod > podcastAllTimeDownloads.allTimeDownloads) {
          podcastData.allTimeDownloads = totalForPeriod;
        } else {
          podcastData.allTimeDownloads = podcastAllTimeDownloads.allTimeDownloads;
        }
      }
    }
    return podcastData;
  }
);

export const selectDownloadTablePodcastIntervalData = createSelector(
  selectRoutedPodcastDownloads,
  (podcastDownloads: PodcastDownloads): DownloadsTableIntervalModel => {
    if (podcastDownloads && podcastDownloads.downloads) {
      return {
        id: podcastDownloads.id,
        downloads: mapMetricsToTimeseriesData(podcastDownloads.downloads)
      };
    }
  }
);

export const selectDownloadTableEpisodeMetrics = createSelector(
  selectRoutedPageEpisodes,
  selectRoutedEpisodePageDownloads,
  selectRoutedPageEpisodeAllTimeDownloads,
  selectSelectedEpisodeGuids,
  (episodes: Episode[],
   episodeDownloads: EpisodeDownloads[],
   episodeAllTimeDownloads: EpisodeAllTimeDownloads[],
   selectedEpisodeGuids: string[]): DownloadsTableModel[] => {
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
            color: getColor(idx),
            totalForPeriod,
            // feels bad. paged downloads that have their own charted state and selected episodes are a weird mix
            // so selected episodes only affects charted status if there is already a selected episodes
            charted: entity.charted &&
              (!selectedEpisodeGuids || selectedEpisodeGuids.indexOf(episode.guid) > -1)
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

export const selectDownloadTableEpisodeIntervalData = createSelector(
  selectRoutedPageEpisodes,
  selectRoutedEpisodePageDownloads,
  selectSelectedEpisodeGuids,
  (episodes: Episode[],
   episodeDownloads: EpisodeDownloads[]): DownloadsTableIntervalModel[] => {
    if (episodes.length && episodeDownloads.length) {
      return episodes
        .filter(episode => {
          const entity = episodeDownloads.find(e => e.guid === episode.guid);
          return entity && entity.downloads;
        })
        .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
        .map((episode: Episode, idx) => {
          const entity = episodeDownloads.find(e => e.guid === episode.guid);
          const downloads = entity.downloads;
          const episodeTableData: DownloadsTableIntervalModel = {
            id: episode.guid,
            downloads: mapMetricsToTimeseriesData(downloads)
          };
          return episodeTableData;
        });
    }
  }
);

export const selectDownloadTableIntervalData = createSelector(
  selectRouter,
  selectDownloadTablePodcastIntervalData,
  selectDownloadTableEpisodeIntervalData,
  (routerParams, podcastIntervalData, episodeIntervalData): any[][] => {
    if (episodeIntervalData && episodeIntervalData.every(episode => episode.downloads && episode.downloads.length > 0)) {
      if (routerParams.chartType !== CHARTTYPE_EPISODES && podcastIntervalData && podcastIntervalData.downloads) {
        return [
          podcastIntervalData.downloads.map(downloads => formatDateForInterval(new Date(downloads.date), routerParams.interval)),
          podcastIntervalData.downloads.map(downloads => downloads.value),
          ...episodeIntervalData.map(data => data.downloads.map(downloads => downloads.value))
        ];
      } else {
        return [
          episodeIntervalData[0].downloads.map(downloads => formatDateForInterval(new Date(downloads.date), routerParams.interval)),
          ...episodeIntervalData.map(data => data.downloads.map(downloads => downloads.value))
        ];
      }
    }
  }
);
