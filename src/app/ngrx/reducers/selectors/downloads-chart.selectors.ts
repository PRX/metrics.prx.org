import { createSelector } from '@ngrx/store';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { Episode, EpisodeDownloads, PodcastDownloads, RouterParams,
  CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedEpisodePageDownloads } from './episode-downloads.selectors';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, getTotal,
  neutralColor, standardColor, getColor } from '../../../shared/util/chart.util';

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
      .map((episode: Episode) => {
        return {
          guid: episode.guid,
          label: episode.title,
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
  (routerParams: RouterParams,
   episodes: Episode[],
   PodcastDownloads: PodcastDownloads,
   episodeDownloads: EpisodeDownloads[]): TimeseriesChartModel[] => {
    let chartedPodcastDownloads: TimeseriesChartModel,
      chartedEpisodeDownloads: TimeseriesChartModel[];

    if (routerParams.chartType === CHARTTYPE_PODCAST ||
      (PodcastDownloads && PodcastDownloads.charted && routerParams.chartType === CHARTTYPE_STACKED)) {
      const downloads = podcastDownloadMetrics(PodcastDownloads);
      chartedPodcastDownloads = {
        ...downloads,
        data: mapMetricsToTimeseriesData(downloads.data),
        color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor
      };
    }

    if (routerParams.chartType === CHARTTYPE_EPISODES || routerParams.chartType === CHARTTYPE_STACKED) {
      if (episodes.length && episodeDownloads.length) {
        chartedEpisodeDownloads = episodeDownloadMetrics(episodes, episodeDownloads)
          .map((downloads, idx, self) => {
            const uniqueLabel = self.filter(e => e.label === downloads.label).length > 1 ?
              downloads.label + ' ' + downloads.guid.split('-')[0].substr(0, 10) : downloads.label;
            return {
              data: mapMetricsToTimeseriesData(downloads.data),
              guid: downloads.guid,
              label: uniqueLabel,
              color: getColor(idx)
            };
          })
          .filter(downloads => episodeDownloads.find(e => e.charted && e.guid === downloads.guid));
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
        if (chartedPodcastDownloads && PodcastDownloads.charted &&
          chartedEpisodeDownloads && chartedEpisodeDownloads.length &&
          chartedEpisodeDownloads.every(d => chartedPodcastDownloads.data.length === d.data.length)) {
          // if we have all the episode data to combine with podcast total
          const allOtherEpisodesData: TimeseriesChartModel = {
            data: subtractTimeseriesDatasets(chartedPodcastDownloads.data, chartedEpisodeDownloads.map(m => m.data)),
            label: 'All Other Episodes',
            color: neutralColor
          };
          chartData = [...chartedEpisodeDownloads, allOtherEpisodesData];
        } else if (chartedPodcastDownloads && PodcastDownloads.charted && chartedPodcastDownloads.data.length) {
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
