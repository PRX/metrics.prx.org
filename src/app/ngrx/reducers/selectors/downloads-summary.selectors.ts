import { createSelector } from '@ngrx/store';
import { selectMetricsTypeRoute } from './router.selectors';
import { selectPodcastMetricsFilteredTotal } from './podcast-metrics.selectors';
import { selectRoutedPodcastRanksTotalDownloads } from './podcast-ranks.selectors';
import { MetricsType, METRICSTYPE_DOWNLOADS } from '../models';

export const selectDownloadsSummaryTotal = createSelector(
  selectMetricsTypeRoute,
  selectPodcastMetricsFilteredTotal,
  selectRoutedPodcastRanksTotalDownloads,
  (metricsType: MetricsType,
   downloadsTotal: number,
   ranksTotal: number) => {
    if (metricsType === METRICSTYPE_DOWNLOADS) {
      return downloadsTotal;
    } else {
      return ranksTotal;
    }
  });
