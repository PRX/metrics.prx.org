import { createSelector } from '@ngrx/store';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterParams, CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../models';
import { selectRouter } from './router.selectors';
import { EpisodeModel } from '../episode.reducer';
import { selectSelectedPageEpisodes } from './episode.selectors';
import { PodcastMetricsModel } from '../podcast-metrics.reducer';
import { selectSelectedPodcastMetrics } from './podcast-metrics.selectors';
import { EpisodeMetricsModel } from '../episode-metrics.reducer';
import { selectEpisodeMetrics } from './episode-metrics.selectors';
import { metricsData } from '../../../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, getTotal,
  neutralColor, standardColor } from '../../../shared/util/chart.util';

export const selectDownloadChartMetrics = createSelector(
  selectRouter,
  selectSelectedPageEpisodes,
  selectSelectedPodcastMetrics,
  selectEpisodeMetrics,
  (routerParams: RouterParams,
   episodes: EpisodeModel[],
   podcastMetrics: PodcastMetricsModel,
   episodeMetrics: EpisodeMetricsModel[]): TimeseriesChartModel[] => {
    let chartedPodcastMetrics: TimeseriesChartModel,
      chartedEpisodeMetrics: TimeseriesChartModel[];

    if (podcastMetrics &&
      routerParams.chartType === CHARTTYPE_PODCAST || (routerParams.chartPodcast && routerParams.chartType === CHARTTYPE_STACKED)) {
      const data = metricsData(routerParams, podcastMetrics);
      if (data) {
        chartedPodcastMetrics = {
          data: mapMetricsToTimeseriesData(data),
          label: 'All Episodes',
          color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor
        };
      }
    }

    if (routerParams.episodeIds &&
      routerParams.chartType === CHARTTYPE_EPISODES || routerParams.chartType === CHARTTYPE_STACKED) {
      chartedEpisodeMetrics = [];
      routerParams.episodeIds.forEach(id => {
        const metrics = episodeMetrics.find(e => e.id === id);
        const episode = episodes.find(e => e.id === id);
        const data = metricsData(routerParams, metrics);
        if (episode && data) {
          chartedEpisodeMetrics.push({
            data: mapMetricsToTimeseriesData(data),
            label: episode.title,
            color: episode.color
          });
        }
      });

      if (routerParams.chartType === CHARTTYPE_STACKED) {
        chartedEpisodeMetrics.sort((a: TimeseriesChartModel, b: TimeseriesChartModel) => {
          return getTotal(b.data) - getTotal(a.data);
        });
      }
    }

    let chartData: TimeseriesChartModel[];
    switch (routerParams.chartType) {
      case CHARTTYPE_STACKED:
        if (chartedPodcastMetrics && routerParams.chartPodcast &&
          chartedEpisodeMetrics && chartedEpisodeMetrics.length) {
          // if we have episodes to combine with podcast total
          const allOtherEpisodesData: TimeseriesChartModel = {
            data: subtractTimeseriesDatasets(chartedPodcastMetrics.data, chartedEpisodeMetrics.map(m => m.data)),
            label: 'All Other Episodes',
            color: neutralColor
          };
          chartData = [...chartedEpisodeMetrics, allOtherEpisodesData];
        } else if (chartedPodcastMetrics && routerParams.chartPodcast &&
          chartedPodcastMetrics.data.length && !(routerParams.episodeIds.length || chartedEpisodeMetrics.length)) {
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
