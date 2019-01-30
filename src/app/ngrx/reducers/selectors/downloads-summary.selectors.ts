import { createSelector } from '@ngrx/store';
import { selectMetricsTypeRoute } from './router.selectors';
import { selectPodcastDownloadsFilteredTotal } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksTotalDownloads } from './podcast-ranks.selectors';
import { MetricsType, METRICSTYPE_DOWNLOADS } from '../models';
import { selectSelectedEpisodeGuids } from './episode-select.selectors';
import { selectSelectedEpisodesRanksTotalDownloads } from './episode-ranks.selectors';

export const selectDownloadsSummaryTotal = createSelector(
  selectMetricsTypeRoute,
  selectPodcastDownloadsFilteredTotal,
  selectRoutedPodcastRanksTotalDownloads,
  selectSelectedEpisodeGuids,
  selectSelectedEpisodesRanksTotalDownloads,
  (metricsType: MetricsType,
   downloadsTotal: number,
   podcastRanksTotal: number,
   guids,
   episodesRanksTotal) => {
    if (metricsType === METRICSTYPE_DOWNLOADS) {
      return downloadsTotal;
    } else {
      return guids && guids.length ? episodesRanksTotal : podcastRanksTotal;
    }
  });
