import { createSelector } from '@ngrx/store';
import { Episode, EpisodeDownloads, PodcastDownloads, RouterParams, PodcastRanks, EpisodeRanks, PodcastTotals, EpisodeTotals, Rank,
  GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, GroupCharted,
  CHARTTYPE_EPISODES, CHARTTYPE_PODCAST, CHARTTYPE_STACKED, CHARTTYPE_GEOCHART, CHARTTYPE_HORIZBAR,
  METRICSTYPE_DOWNLOADS, 
  METRICSTYPE_TRAFFICSOURCES} from '../models';
import { selectRouter } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedEpisodePageDownloads } from './episode-downloads.selectors';
import { podcastDownloadMetrics, episodeDownloadMetrics } from './downloads-chart.selectors';
import { aggregateIntervalsExport, aggregateTotalsExport, isGroupCharted } from '../../../shared/util/chart.util';
import { getTotal } from '../../../shared/util/metrics.util';
import { ISODate } from '../../../shared/util/date';
import { selectSelectedEpisodeGuids } from './episode-select.selectors';
import { selectRoutedPodcastRanks, selectNestedPodcastRanks } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotals, selectNestedPodcastTotals } from './podcast-totals.selectors';
import { selectSelectedEpisodesRanks, selectNestedEpisodesRanks } from './episode-ranks.selectors';
import { selectRoutedGroupCharted } from './group-charted.selectors';
import { selectSelectedEpisodesTotals, selectNestedEpisodesTotals } from './episode-totals.selectors';

export const selectExportDownloads = createSelector(
  selectRouter,
  selectRoutedPageEpisodes,
  selectRoutedPodcastDownloads,
  selectRoutedEpisodePageDownloads,
  (routerParams: RouterParams,
  episodes: Episode[],
  PodcastDownloads: PodcastDownloads,
  episodeDownloads: EpisodeDownloads[]): {label: string, guid?: string, data: any[][]}[] => {
  let chartedPodcastDownloads, chartedEpisodeDownloads;

  if (routerParams.chartType === CHARTTYPE_PODCAST || routerParams.chartType === CHARTTYPE_STACKED) {
    chartedPodcastDownloads = podcastDownloadMetrics(PodcastDownloads);
  }

  if (routerParams.chartType === CHARTTYPE_EPISODES || routerParams.chartType === CHARTTYPE_STACKED) {
    if (episodes.length && episodeDownloads.length) {
      chartedEpisodeDownloads = episodeDownloadMetrics(episodes, episodeDownloads)
        .filter(downloads => episodeDownloads.find(e => e.charted && e.guid === downloads.guid));
    }
  }

  let exportData;
  switch (routerParams.chartType) {
    case CHARTTYPE_STACKED:
      if (chartedPodcastDownloads && PodcastDownloads.charted &&
        chartedEpisodeDownloads && chartedEpisodeDownloads.length) {
        exportData = [chartedPodcastDownloads, ...chartedEpisodeDownloads];
      } else if (chartedPodcastDownloads && PodcastDownloads.charted &&
        chartedPodcastDownloads.data.length && !(chartedEpisodeDownloads && chartedEpisodeDownloads.length)) {
        exportData = [chartedPodcastDownloads];
      } else if (chartedEpisodeDownloads && chartedEpisodeDownloads.length) {
        exportData = chartedEpisodeDownloads;
      }
      break;
    case CHARTTYPE_PODCAST:
      if (chartedPodcastDownloads && chartedPodcastDownloads.data.length) {
        exportData = [chartedPodcastDownloads];
      }
      break;
    case CHARTTYPE_EPISODES:
      if (chartedEpisodeDownloads && chartedEpisodeDownloads.length) {
        exportData = chartedEpisodeDownloads;
      }
      break;
  }
  return exportData;
});

export const toCsvArray = (downloads: {label: string, guid?: string, publishedAt?: Date, total?: number, data?: any[][]}[]): string[][] => {
  if (downloads && downloads.length) {
    const hasGuidCol = downloads.length > 1 && downloads[1].guid;
    const hasPubDateCol = downloads.length > 1 && downloads[1].publishedAt;
    const hasTotalCol = downloads.length > 1 && downloads[1].total;
    const hasDataCols = !!downloads[0].data;
    const csvRows = [
      'data:text/csv;charset=utf-8',
      hasGuidCol ? 'Title' : '""',
      ...(hasGuidCol ? ['GUID'] : []),
      ...(hasPubDateCol ? ['Release Date'] : []),
      ...(hasTotalCol ? ['Total'] : []),
      ...(hasDataCols ? downloads[0].data.map(col => ISODate(col[0])) : [])
    ];
    return [csvRows].concat(downloads.map(d => [
      `"${d.label}"`,
      ...(hasGuidCol ? [d.guid] : []),
      ...(hasPubDateCol ? [d.publishedAt && ISODate(d.publishedAt) || ''] : []),
      ...(hasTotalCol ? [d.total] : []),
      ...(hasDataCols ? d.data.map(col => col[1].toString()) : [])
    ]));
  }
};

export const joinCsvArray = (data: string[][]): string => {
  return data && data.reduce((acc, row) => {
    if (row) {
      acc += row.join(',') + '\r\n';
    }
    return acc;
  }, '');
};

export const podcastExportRanks =
  (routerParams: RouterParams,
  podcastRanks: PodcastRanks,
  podcastTotals: PodcastTotals,
  groupsCharted?: GroupCharted[]): {label: string, total?: number, data?: any[][]}[] => {
  if (routerParams.chartType === CHARTTYPE_GEOCHART || routerParams.chartType === CHARTTYPE_HORIZBAR) {
    // export totals because it has all
    if (podcastTotals && podcastTotals.ranks) {
      return podcastTotals.ranks.map((rank: Rank, i) => {
        return {
          label: rank.label,
          total: rank.total
        };
      })
      .filter(entry => isGroupCharted(groupsCharted, entry.label) && (entry.label !== 'Other' || entry.total !== 0));
    }
  } else {
    return podcastRanks && podcastRanks.ranks && podcastRanks.ranks
      .map((rank: Rank, i: number) => {
        const downloads = podcastRanks.downloads
          .map(data => [data[0], data[1][i]]);
        return {
          data: downloads,
          label: rank.label
        };
      })
      .filter((entry) => isGroupCharted(groupsCharted, entry.label) && (entry.label !== 'Other' || getTotal(entry.data) !== 0));
  }
};

export const selectRoutedPodcastExportRanks = createSelector(
  selectRouter,
  selectRoutedPodcastRanks,
  selectRoutedPodcastTotals,
  selectRoutedGroupCharted,
  podcastExportRanks
);

export const selectNestedPodcastExportRanks = createSelector(
  selectRouter,
  selectNestedPodcastRanks,
  selectNestedPodcastTotals,
  podcastExportRanks
);

export const episodeExportRanks =
(routerParams: RouterParams,
episodeRanks: EpisodeRanks[],
episodeTotals: EpisodeTotals[],
groupsCharted?: GroupCharted[]): {label: string, total?: number, data?: any[][]}[] => {
  if (routerParams.chartType === CHARTTYPE_GEOCHART || routerParams.chartType === CHARTTYPE_HORIZBAR) {
    return episodeTotals && aggregateTotalsExport(episodeTotals, groupsCharted);
  } else {
    return episodeRanks && aggregateIntervalsExport(episodeRanks, groupsCharted);
  }
};

export const selectSelectedEpisodeExportRanks = createSelector(
  selectRouter,
  selectSelectedEpisodesRanks,
  selectSelectedEpisodesTotals,
  selectRoutedGroupCharted,
  episodeExportRanks
);

export const selectNestedEpisodeExportRanks = createSelector(
  selectRouter,
  selectNestedEpisodesRanks,
  selectNestedEpisodesTotals,
  episodeExportRanks
);

export const selectExportData = createSelector(
  selectRouter,
  selectExportDownloads,
  selectRoutedPodcastExportRanks,
  selectNestedPodcastExportRanks,
  selectSelectedEpisodeGuids,
  selectSelectedEpisodeExportRanks,
  selectNestedEpisodeExportRanks,
  (routerParams: RouterParams,
  exportDownloads,
  routedPodcastRanks,
  nestedPodcastRanks,
  guids,
  selectedEpisodeRanks,
  nestedEpisodeRanks) => {
    if (routerParams.metricsType === METRICSTYPE_DOWNLOADS) {
        return exportDownloads;
    } else {
      if (routerParams.group === GROUPTYPE_GEOCOUNTRY && routerParams.filter) {
        if (guids && guids.length) {
          return nestedEpisodeRanks;
        } else {
          return nestedPodcastRanks;
        }
      } else {
        if (guids && guids.length) {
          return selectedEpisodeRanks;
        } else {
          return routedPodcastRanks;
        }
      }
    }
  }
);
