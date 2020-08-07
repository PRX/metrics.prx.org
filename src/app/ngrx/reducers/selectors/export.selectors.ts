import { createSelector } from '@ngrx/store';
import {
  Episode,
  EpisodeDownloads,
  Podcast,
  PodcastDownloads,
  RouterParams,
  PodcastRanks,
  EpisodeRanks,
  PodcastTotals,
  EpisodeTotals,
  Rank,
  ExportData,
  GROUPTYPE_GEOCOUNTRY,
  GroupCharted,
  CHARTTYPE_EPISODES,
  CHARTTYPE_PODCAST,
  CHARTTYPE_STACKED,
  CHARTTYPE_GEOCHART,
  CHARTTYPE_HORIZBAR,
  MetricsType,
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_DROPDAY,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_TRAFFICSOURCES,
  INTERVAL_HOURLY,
  IntervalModel,
  EpisodeDropday,
  PodcastListeners,
  METRICSTYPE_LISTENERS
} from '../models';
import { selectRouter, selectIntervalRoute, selectMetricsTypeRoute } from './router.selectors';
import { selectRoutedPageEpisodes } from './episode.selectors';
import { selectRoutedPodcastDownloads } from './podcast-downloads.selectors';
import { selectRoutedEpisodePageDownloads } from './episode-downloads.selectors';
import { selectSelectedEpisodeDropdays } from './episode-dropday.selectors';
import { podcastDownloadMetrics, episodeDownloadMetrics } from './downloads-chart.selectors';
import { aggregateIntervalsExport, aggregateTotalsExport, isGroupCharted } from '@app/shared/util/chart.util';
import { getTotal } from '@app/shared/util/metrics.util';
import * as dateUtil from '@app/shared/util/date';
import { selectDownloadsSelectedEpisodeGuids, selectAggregateSelectedEpisodeGuids } from './episode-select.selectors';
import { selectRoutedPodcastRanks, selectNestedPodcastRanks } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotals, selectNestedPodcastTotals } from './podcast-totals.selectors';
import { selectSelectedEpisodesRanks, selectNestedEpisodesRanks } from './episode-ranks.selectors';
import { selectRoutedGroupCharted } from './group-charted.selectors';
import { selectSelectedEpisodesTotals, selectNestedEpisodesTotals } from './episode-totals.selectors';
import { selectRoutedPodcast } from './podcast.selectors';
import { cumDownloads } from './dropday-chart.selectors';
import { selectRoutedPodcastListeners } from './podcast-listeners.selectors';

export const selectExportDownloads = createSelector(
  selectRouter,
  selectRoutedPageEpisodes,
  selectRoutedPodcastDownloads,
  selectRoutedEpisodePageDownloads,
  selectDownloadsSelectedEpisodeGuids,
  (
    routerParams: RouterParams,
    episodes: Episode[],
    podcastDownloads: PodcastDownloads,
    episodeDownloads: EpisodeDownloads[],
    selectedEpisodeGuids: string[]
  ): ExportData[] => {
    let chartedPodcastDownloads: ExportData, chartedEpisodeDownloads: ExportData[];

    if (routerParams.chartType === CHARTTYPE_PODCAST || routerParams.chartType === CHARTTYPE_STACKED) {
      chartedPodcastDownloads = podcastDownloadMetrics(podcastDownloads);
    }

    if (routerParams.chartType === CHARTTYPE_EPISODES || routerParams.chartType === CHARTTYPE_STACKED) {
      if (episodes.length && episodeDownloads.length) {
        chartedEpisodeDownloads = episodeDownloadMetrics(episodes, episodeDownloads).filter(
          downloads =>
            episodeDownloads.find(e => e.charted && e.guid === downloads.guid) &&
            (!selectedEpisodeGuids || selectedEpisodeGuids.indexOf(downloads.guid) > -1)
        );
      }
    }

    let exportData: ExportData[];
    switch (routerParams.chartType) {
      case CHARTTYPE_STACKED:
        if (chartedPodcastDownloads && podcastDownloads.charted && chartedEpisodeDownloads && chartedEpisodeDownloads.length) {
          exportData = [chartedPodcastDownloads, ...chartedEpisodeDownloads];
        } else if (
          chartedPodcastDownloads &&
          podcastDownloads.charted &&
          chartedPodcastDownloads.data.length &&
          !(chartedEpisodeDownloads && chartedEpisodeDownloads.length)
        ) {
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
  }
);

export const selectExportDropday = createSelector(
  selectRouter,
  selectSelectedEpisodeDropdays,
  (routerParams, dropdays: EpisodeDropday[]): ExportData[] => {
    return (
      dropdays &&
      dropdays
        .filter(dropday => dropday.downloads)
        .map(dropday => {
          switch (routerParams.chartType) {
            case CHARTTYPE_HORIZBAR:
              return {
                label: dropday.title,
                guid: dropday.guid,
                publishedAt: dropday.publishedAt,
                total: getTotal(dropday.downloads)
              };
            case CHARTTYPE_EPISODES:
              return {
                label: dropday.title,
                guid: dropday.guid,
                publishedAt: dropday.publishedAt,
                data: cumDownloads(dropday.downloads)
              };
          }
        })
    );
  }
);

export const selectExportListeners = createSelector(selectRoutedPodcastListeners, (routedPodcastData: PodcastListeners) => {
  if (routedPodcastData && routedPodcastData.listeners) {
    return [
      {
        label: 'Unique Listeners',
        data: routedPodcastData.listeners
      }
    ];
  }
});

export const toCsvArray = (downloads: ExportData[], dateFormat?: Function): (string | number)[][] => {
  if (downloads && downloads.length) {
    const hasGuidCol = downloads.length > 1 && downloads[1].guid;
    const hasPubDateCol = downloads.length > 1 && downloads[1].publishedAt;
    const hasTotalCol = downloads.length > 1 && downloads[1].total;
    const hasDataCols = downloads[0].data && downloads[0].data.length;
    const csvRows = [
      hasGuidCol ? 'Title' : '',
      ...(hasGuidCol ? ['GUID'] : []),
      ...(hasPubDateCol ? ['Release Date'] : []),
      ...(hasTotalCol ? ['Total'] : []),
      ...(hasDataCols && dateFormat ? downloads[0].data.map(col => dateFormat(new Date(col[0]))) : []),
      ...(hasDataCols && !dateFormat ? downloads[downloads.length - 1].data.map((col, i) => (i && i.toString()) || 'Drop') : [])
    ];
    return [csvRows].concat(
      downloads.map(d => [
        d.label,
        ...(hasGuidCol ? [d.guid] : []),
        ...(hasPubDateCol ? [(d.publishedAt && dateUtil.ISODate(d.publishedAt)) || ''] : []),
        ...(hasTotalCol ? [d.total] : []),
        ...(hasDataCols && d.data ? d.data.map(col => col[1]) : [])
      ])
    );
  }
};

export const joinCsvArray = (data: (string | number)[][]): string => {
  return (
    data &&
    'data:text/csv;charset=utf-8,' +
      data
        .map(
          row =>
            row &&
            row
              .map(v => {
                return v && typeof v === 'string' && v.indexOf(',') > -1 ? `"${v}"` : v;
              })
              .join(',')
        )
        .join('\r\n')
  );
};

export const podcastExportRanks = (
  routerParams: RouterParams,
  podcastRanks: PodcastRanks,
  podcastTotals: PodcastTotals,
  groupsCharted?: GroupCharted[]
): ExportData[] => {
  if (routerParams.chartType === CHARTTYPE_GEOCHART || routerParams.chartType === CHARTTYPE_HORIZBAR) {
    // export totals because it has all
    if (podcastTotals && podcastTotals.ranks) {
      return podcastTotals.ranks
        .map((rank: Rank, i) => {
          return {
            label: rank.label,
            total: rank.total
          };
        })
        .filter(entry => isGroupCharted(groupsCharted, entry.label) && (entry.label !== 'Other' || entry.total !== 0));
    }
  } else {
    return (
      podcastRanks &&
      podcastRanks.ranks &&
      podcastRanks.ranks
        .map((rank: Rank, i: number) => {
          const downloads = podcastRanks.downloads.map(data => [data[0], data[1][i]]);
          return {
            data: downloads,
            label: rank.label
          };
        })
        .filter(entry => isGroupCharted(groupsCharted, entry.label) && (entry.label !== 'Other' || getTotal(entry.data) !== 0))
    );
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

export const episodeExportRanks = (
  routerParams: RouterParams,
  episodeRanks: EpisodeRanks[],
  episodeTotals: EpisodeTotals[],
  groupsCharted?: GroupCharted[]
): { label: string; total?: number; data?: any[][] }[] => {
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

export const selectExportRanks = createSelector(
  selectRouter,
  selectRoutedPodcastExportRanks,
  selectNestedPodcastExportRanks,
  selectAggregateSelectedEpisodeGuids,
  selectSelectedEpisodeExportRanks,
  selectNestedEpisodeExportRanks,
  (routerParams, routedPodcastRanks, nestedPodcastRanks, guids, selectedEpisodeRanks, nestedEpisodeRanks) => {
    switch (routerParams.metricsType) {
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
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

export const selectExportData = createSelector(
  selectRouter,
  selectExportDownloads,
  selectExportDropday,
  selectExportListeners,
  selectExportRanks,
  (routerParams: RouterParams, exportDownloads, exportDropday, exportListeners, exportRanks): ExportData[] => {
    switch (routerParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        return exportDownloads;
      case METRICSTYPE_DROPDAY:
        return exportDropday;
      case METRICSTYPE_LISTENERS:
        return exportListeners;
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        return exportRanks;
    }
  }
);

export const selectExportData2DArray = createSelector(
  selectMetricsTypeRoute,
  selectIntervalRoute,
  selectExportData,
  (metricsType: MetricsType, interval: IntervalModel, exportData: ExportData[]): (string | number)[][] => {
    if (metricsType === METRICSTYPE_DROPDAY) {
      return toCsvArray(exportData);
    } else if (interval === INTERVAL_HOURLY) {
      return toCsvArray(exportData, dateUtil.defaultTZ);
    } else {
      return toCsvArray(exportData, dateUtil.ISODate);
    }
  }
);

export const selectExportFilename = createSelector(
  selectRouter,
  selectRoutedPodcast,
  (routerParams: RouterParams, podcast: Podcast): string => {
    // strip special characters and spaces out of podcast title for filename
    // https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
    const podcastTitle = podcast && podcast.title.replace(/[.,\/#?!$%\^&\*;:|"'{}=\-_`~()\s]/g, '');
    const beginDate = dateUtil.ISODate(routerParams.beginDate, '');
    const endDate = dateUtil.ISODate(routerParams.endDate, '');
    let dataDesc: string;
    if (routerParams.metricsType === METRICSTYPE_DOWNLOADS || routerParams.metricsType === METRICSTYPE_DROPDAY) {
      dataDesc = 'downloads';
    } else if (routerParams.metricsType === METRICSTYPE_LISTENERS) {
      dataDesc = 'uniquelisteners';
    } else {
      if (routerParams.group === GROUPTYPE_GEOCOUNTRY) {
        if (routerParams.filter) {
          dataDesc = routerParams.filter;
        } else {
          dataDesc = 'world';
        }
      } else {
        dataDesc = routerParams.group;
      }
    }
    const interval = routerParams.interval.name.replace(/\s/g, '');
    return routerParams.metricsType === METRICSTYPE_DROPDAY
      ? `${podcastTitle}_${routerParams.days}day-${endDate}_${interval}_${dataDesc}`
      : `${podcastTitle}_${beginDate}-${endDate}_${interval}_${dataDesc}`;
  }
);
