import { createSelector } from '@ngrx/store';
import { selectRoutedPodcastRanksChartMetrics, selectNestedPodcastRanksChartMetrics } from './podcast-ranks.selectors';
import { selectSelectedEpisodeRanksChartMetrics, selectNestedEpisodesRanksChartMetrics } from './episode-ranks.selectors';
import { selectSelectedEpisodeGuids } from './episode-select.selectors';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';

export const selectChartMetrics =
  createSelector(selectSelectedEpisodeGuids, selectSelectedEpisodeRanksChartMetrics, selectRoutedPodcastRanksChartMetrics,
  (guids: string[], episode: TimeseriesChartModel[],
    podcast: CategoryChartModel[] | TimeseriesChartModel[]): CategoryChartModel[] | TimeseriesChartModel[] => {
    return guids && guids.length ? episode : podcast;
  });

export const selectNestedChartMetrics =
  createSelector(selectSelectedEpisodeGuids, selectNestedEpisodesRanksChartMetrics, selectNestedPodcastRanksChartMetrics,
  (guids: string[],
    episode: TimeseriesChartModel[],
    podcast: TimeseriesChartModel[]): TimeseriesChartModel[] => {
    return guids && guids.length ? episode : podcast;
  });
