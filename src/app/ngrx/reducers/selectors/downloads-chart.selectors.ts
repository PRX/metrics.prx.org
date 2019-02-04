import { createSelector } from '@ngrx/store';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { Episode, EpisodeDownloads, RouterParams, CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { PodcastDownloads } from '../models/podcast-downloads.model';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedEpisodePageDownloads } from './episode-downloads.selectors';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, getTotal,
  neutralColor, standardColor, getColor } from '../../../shared/util/chart.util';

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

    if (PodcastDownloads &&
      PodcastDownloads.downloads &&
      routerParams.chartType === CHARTTYPE_PODCAST ||
      (PodcastDownloads && PodcastDownloads.charted && routerParams.chartType === CHARTTYPE_STACKED)) {
      chartedPodcastDownloads = {
        data: mapMetricsToTimeseriesData(PodcastDownloads.downloads),
        label: 'All Episodes',
        color: routerParams.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor
      };
    }

    if (routerParams.chartType === CHARTTYPE_EPISODES || routerParams.chartType === CHARTTYPE_STACKED) {
      if (episodes.length && episodeDownloads.length) {
        chartedEpisodeDownloads = episodes
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
          .filter(episode => {
            const entity = episodeDownloads.find(e => e.charted && e.guid === episode.guid);
            return entity && entity.downloads;
          })
          .map((episode) => {
            return {
              ...episode,
              data: mapMetricsToTimeseriesData(episodeDownloads.find(e => e.charted && e.guid === episode.guid).downloads)
            };
          });
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
          chartedEpisodeDownloads && chartedEpisodeDownloads.length) {
          // if we have episodes to combine with podcast total
          const allOtherEpisodesData: TimeseriesChartModel = {
            data: subtractTimeseriesDatasets(chartedPodcastDownloads.data, chartedEpisodeDownloads.map(m => m.data)),
            label: 'All Other Episodes',
            color: neutralColor
          };
          chartData = [...chartedEpisodeDownloads, allOtherEpisodesData];
        } else if (chartedPodcastDownloads && PodcastDownloads.charted &&
          chartedPodcastDownloads.data.length && !(chartedEpisodeDownloads && chartedEpisodeDownloads.length)) {
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
