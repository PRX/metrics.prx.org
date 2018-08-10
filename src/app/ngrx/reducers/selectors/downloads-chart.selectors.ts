import { createSelector } from '@ngrx/store';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { Episode, RouterParams, CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { selectRoutedPodcastMetrics } from './podcast-metrics.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { selectRoutedEpisodePageMetrics } from './episode-metrics.selectors';
import { metricsData } from '../../../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, getTotal,
  neutralColor, standardColor, getColor } from '../../../shared/util/chart.util';

export const selectDownloadChartMetrics = createSelector(
  selectRouter,
  selectRoutedPageEpisodes,
  selectRoutedPodcastMetrics,
  selectRoutedEpisodePageMetrics,
  (routerParams: RouterParams,
   episodes: Episode[],
   podcastMetrics: PodcastMetricsModel,
   episodeMetrics: EpisodeMetricsModel[]): TimeseriesChartModel[] => {
    let chartedPodcastMetrics: TimeseriesChartModel,
      chartedEpisodeMetrics: TimeseriesChartModel[];

    if (podcastMetrics &&
      routerParams.chartType === CHARTTYPE_PODCAST ||
      (podcastMetrics && podcastMetrics.charted && routerParams.chartType === CHARTTYPE_STACKED)) {
      const data = metricsData(routerParams, podcastMetrics);
      if (data) {
        chartedPodcastMetrics = {
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
          .map((episode: Episode, idx) => {
            return {
              guid: episode.guid,
              label: episode.title,
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
        if (chartedPodcastMetrics && podcastMetrics.charted &&
          chartedEpisodeMetrics && chartedEpisodeMetrics.length) {
          // if we have episodes to combine with podcast total
          const allOtherEpisodesData: TimeseriesChartModel = {
            data: subtractTimeseriesDatasets(chartedPodcastMetrics.data, chartedEpisodeMetrics.map(m => m.data)),
            label: 'All Other Episodes',
            color: neutralColor
          };
          chartData = [...chartedEpisodeMetrics, allOtherEpisodesData];
        } else if (chartedPodcastMetrics && podcastMetrics.charted &&
          chartedPodcastMetrics.data.length && !(chartedEpisodeMetrics && chartedEpisodeMetrics.length)) {
          chartData = [chartedPodcastMetrics];
        } else if (chartedEpisodeMetrics && chartedEpisodeMetrics.length) {
          chartData = chartedEpisodeMetrics;
        }
        break;
      case CHARTTYPE_PODCAST:
        if (chartedPodcastMetrics && chartedPodcastMetrics.data.length) {
          chartData = [chartedPodcastMetrics];
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
