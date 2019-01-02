import { createSelector } from '@ngrx/store';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { Episode, RouterParams, CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { PodcastDownloads } from "../models/podcast-downloads.model";
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { selectRoutedEpisodePageMetrics } from './episode-metrics.selectors';
import { metricsData } from '../../../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, getTotal,
  neutralColor, standardColor, getColor } from '../../../shared/util/chart.util';

export const selectDownloadChartMetrics = createSelector(
  selectRouter,
  selectRoutedPageEpisodes,
  selectRoutedPodcastDownloads,
  selectRoutedEpisodePageMetrics,
  (routerParams: RouterParams,
   episodes: Episode[],
   PodcastDownloads: PodcastDownloads,
   episodeMetrics: EpisodeMetricsModel[]): TimeseriesChartModel[] => {
    let chartedPodcastDownloads: TimeseriesChartModel,
      chartedEpisodeMetrics: TimeseriesChartModel[];

    if (PodcastDownloads &&
      routerParams.chartType === CHARTTYPE_PODCAST ||
      (PodcastDownloads && PodcastDownloads.charted && routerParams.chartType === CHARTTYPE_STACKED)) {
      const data = metricsData(routerParams, PodcastDownloads);
      if (data) {
        chartedPodcastDownloads = {
          data: mapMetricsToTimeseriesData(data),
          label: 'All Episodes',
          color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor
        };
      }
    }

    if (routerParams.chartType === CHARTTYPE_EPISODES || routerParams.chartType === CHARTTYPE_STACKED) {
      if (episodes.length && episodeMetrics.length) {
        chartedEpisodeMetrics = episodes
          .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
          .map((episode: Episode, idx, self) => {
            const uniqueLabel = self.filter(e => e.title === episode.title).length > 1 ?
              episode.title + ' ' + episode.guid.split('-')[0].substr(0, 10) :  episode.title;
            return {
              guid: episode.guid,
              label: uniqueLabel,
              color: getColor(idx)
            };
          })
          .filter(episode => metricsData(routerParams, episodeMetrics.find(e => e.charted && e.guid === episode.guid)))
          .map((episode) => {
            return {
              ...episode,
              data: mapMetricsToTimeseriesData(metricsData(routerParams, episodeMetrics.find(e => e.guid === episode.guid)))
            };
          });
      }

      if (chartedEpisodeMetrics && routerParams.chartType === CHARTTYPE_STACKED) {
        chartedEpisodeMetrics.sort((a: TimeseriesChartModel, b: TimeseriesChartModel) => {
          return getTotal(b.data) - getTotal(a.data);
        });
      }
    }

    let chartData: TimeseriesChartModel[];
    switch (routerParams.chartType) {
      case CHARTTYPE_STACKED:
        if (chartedPodcastDownloads && PodcastDownloads.charted &&
          chartedEpisodeMetrics && chartedEpisodeMetrics.length) {
          // if we have episodes to combine with podcast total
          const allOtherEpisodesData: TimeseriesChartModel = {
            data: subtractTimeseriesDatasets(chartedPodcastDownloads.data, chartedEpisodeMetrics.map(m => m.data)),
            label: 'All Other Episodes',
            color: neutralColor
          };
          chartData = [...chartedEpisodeMetrics, allOtherEpisodesData];
        } else if (chartedPodcastDownloads && PodcastDownloads.charted &&
          chartedPodcastDownloads.data.length && !(chartedEpisodeMetrics && chartedEpisodeMetrics.length)) {
          chartData = [chartedPodcastDownloads];
        } else if (chartedEpisodeMetrics && chartedEpisodeMetrics.length) {
          chartData = chartedEpisodeMetrics;
        }
        break;
      case CHARTTYPE_PODCAST:
        if (chartedPodcastDownloads && chartedPodcastDownloads.data.length) {
          chartData = [chartedPodcastDownloads];
        }
        break;
      case CHARTTYPE_EPISODES:
        if (chartedEpisodeMetrics && chartedEpisodeMetrics.length) {
          chartData = chartedEpisodeMetrics;
        }
        break;
    }
    return chartData;
  }
);
