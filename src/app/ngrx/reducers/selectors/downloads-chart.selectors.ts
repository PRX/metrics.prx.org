import { createSelector } from '@ngrx/store';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { Episode, EpisodeDownloads, PodcastDownloads, RouterParams,
  CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { selectDownloadsSelectedEpisodeGuids } from './episode-select.selectors';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedEpisodePageDownloads } from './episode-downloads.selectors';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, getTotal,
  neutralColor, standardColor, getColor, uniqueEpisodeLabel } from '@app/shared/util/chart.util';

export const podcastDownloadMetrics = (podcastDownloads: PodcastDownloads): {label: string, data: any[][]} => {
  if (podcastDownloads && podcastDownloads.downloads) {
    return {
      label: 'All Episodes',
      data: podcastDownloads.downloads
    };
  }
};

export const episodeDownloadMetrics =
  (episodes: Episode[], episodeDownloads: EpisodeDownloads[]): {guid: string, label: string, publishedAt: Date, data: any[][]}[] => {
  if (episodes.length && episodeDownloads && episodeDownloads.length) {
    return episodes
      .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
      .filter(episode => {
        const data = episodeDownloads.find(e => e.guid === episode.guid);
        return data && data.downloads && data.downloads.length;
      })
      .map((episode: Episode, i, self) => {
        return {
          guid: episode.guid,
          label: uniqueEpisodeLabel(episode, self),
          publishedAt: episode.publishedAt,
          data: episodeDownloads.find(e => e.guid === episode.guid).downloads
        };
      });
    }
  };

export const selectDownloadChartMetrics = createSelector(
  selectRouter,
  selectRoutedPageEpisodes,
  selectRoutedPodcastDownloads,
  selectRoutedEpisodePageDownloads,
  selectDownloadsSelectedEpisodeGuids,
  (routerParams: RouterParams,
   episodes: Episode[],
   podcastDownloads: PodcastDownloads,
   episodeDownloads: EpisodeDownloads[],
   selectedEpisodeGuids: string[]): TimeseriesChartModel[] => {
    let chartedPodcastDownloads: TimeseriesChartModel,
      chartedEpisodeDownloads: TimeseriesChartModel[];

    if (routerParams.chartType === CHARTTYPE_PODCAST ||
      (podcastDownloads && podcastDownloads.charted && routerParams.chartType === CHARTTYPE_STACKED)) {
      const downloads = podcastDownloadMetrics(podcastDownloads);
      if (downloads) {
        chartedPodcastDownloads = {
          ...downloads,
          data: mapMetricsToTimeseriesData(downloads.data),
          color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor
        };
      }
    }

    if (routerParams.chartType === CHARTTYPE_EPISODES || routerParams.chartType === CHARTTYPE_STACKED) {
      if (episodes.length && episodeDownloads.length) {
        chartedEpisodeDownloads = episodeDownloadMetrics(episodes, episodeDownloads)
          .map((downloads, idx) => {
            return {
              data: mapMetricsToTimeseriesData(downloads.data),
              guid: downloads.guid,
              label: downloads.label,
              color: getColor(idx)
            };
          })
          .filter(downloads =>
            episodeDownloads.find(e => e.charted && e.guid === downloads.guid) &&
              (!selectedEpisodeGuids || selectedEpisodeGuids.indexOf(downloads.guid) > -1));
      }

      if (chartedEpisodeDownloads && routerParams.chartType === CHARTTYPE_STACKED) {
        chartedEpisodeDownloads.sort((a: TimeseriesChartModel, b: TimeseriesChartModel) => {
          return getTotal(b.data) - getTotal(a.data);
        });
      }
    }

    let chartData: TimeseriesChartModel[];
    switch (routerParams.chartType) {
      case CHARTTYPE_STACKED:
        if (chartedPodcastDownloads && podcastDownloads.charted &&
          chartedEpisodeDownloads && chartedEpisodeDownloads.length &&
          chartedEpisodeDownloads.every(d => chartedPodcastDownloads.data.length === d.data.length)) {
          // if we have all the episode data to combine with podcast total
          const allOtherEpisodesData: TimeseriesChartModel = {
            data: subtractTimeseriesDatasets(chartedPodcastDownloads.data, chartedEpisodeDownloads.map(m => m.data)),
            label: 'All Other Episodes',
            color: neutralColor
          };
          chartData = [...chartedEpisodeDownloads, allOtherEpisodesData];
        } else if (chartedPodcastDownloads && podcastDownloads.charted && chartedPodcastDownloads.data.length) {
          chartData = [chartedPodcastDownloads];
        } else if (chartedEpisodeDownloads && chartedEpisodeDownloads.length) {
          chartData = chartedEpisodeDownloads;
        }
        break;
      case CHARTTYPE_PODCAST:
        if (chartedPodcastDownloads && chartedPodcastDownloads.data.length) {
          chartData = [chartedPodcastDownloads];
        }
        break;
      case CHARTTYPE_EPISODES:
        if (chartedEpisodeDownloads && chartedEpisodeDownloads.length) {
          chartData = chartedEpisodeDownloads;
        }
        break;
    }
    return chartData;
  }
);
