import { createSelector } from '@ngrx/store';
import {
  selectRoutedPodcastRanksLoading, selectRoutedPodcastRanksLoaded, selectRoutedPodcastRanksError,
  selectRoutedPodcastRanksTotalDownloads, selectRoutedPodcastRanksChartMetrics,
  selectNestedPodcastRanksLoading, selectNestedPodcastRanksLoaded, selectNestedPodcastRanksError,
  selectNestedPodcastRanksChartMetrics } from './podcast-ranks.selectors';
import {
  selectSelectedEpisodesRanksLoading, selectSelectedEpisodesRanksLoaded, selectSelectedEpisodesRanksError,
  selectSelectedEpisodesRanksTotalDownloads, selectSelectedEpisodeRanksChartMetrics,
  selectNestedEpisodesRanksLoading, selectNestedEpisodesRanksLoaded, selectNestedEpisodesRanksError,
  selectNestedEpisodesRanksChartMetrics } from './episode-ranks.selectors';
import { selectEpisodeSelectedEpisodeGuids } from './episode-select.selectors';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';

export const selectChartMetrics =
  createSelector(selectEpisodeSelectedEpisodeGuids, selectSelectedEpisodeRanksChartMetrics, selectRoutedPodcastRanksChartMetrics,
  (guids: string[], episode: TimeseriesChartModel[],
    podcast: CategoryChartModel[] | TimeseriesChartModel[]): CategoryChartModel[] | TimeseriesChartModel[] => {
    return guids && guids.length ? episode : podcast;
  });
