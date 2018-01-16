import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { EpisodeModel, FilterModel, PodcastModel, EpisodeMetricsModel, PodcastMetricsModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY,
  CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED  } from '../ngrx';
import { selectEpisodes, selectFilter, selectEpisodeMetrics, selectPodcastMetrics } from '../ngrx/reducers';
import { CastlePodcastAllTimeMetricsLoadAction, CastleEpisodeAllTimeMetricsLoadAction, GoogleAnalyticsEventAction } from '../ngrx/actions';

import { findPodcastMetrics, filterPodcastEpisodePage, filterEpisodeMetricsPage, filterAllPodcastEpisodes, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, neutralColor } from '../shared/util/chart.util';
import * as dateFormat from '../shared/util/date/date.format';
import { getAmountOfIntervals } from '../shared/util/date/date.util';
import { isPodcastChanged } from '../shared/util/filter.util';
import * as moment from 'moment';

@Component({
  selector: 'metrics-downloads-table',
  templateUrl: 'downloads-table.component.html',
  styleUrls: ['downloads-table.component.css']

})
export class DownloadsTableComponent implements OnDestroy {
  @Input() totalPages;
  @Output() podcastChartToggle = new EventEmitter();
  @Output() episodeChartToggle = new EventEmitter();
  @Output() chartSingleEpisode = new EventEmitter();
  @Output() pageChange = new EventEmitter();
  filterStoreSub: Subscription;
  filter: FilterModel;
  allEpisodesSub: Subscription;
  episodes: EpisodeModel[];
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[];
  podcastMetricsStoreSub: Subscription;
  podcastMetrics: PodcastMetricsModel;
  podcastTableData: {};
  episodeTableData: any[];
  dateRange: string[];
  bindToIntervalHourly = INTERVAL_HOURLY;
  expanded = false;

  constructor(public store: Store<any>) {

    this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter) {
        if (isPodcastChanged(newFilter, this.filter)) {
          this.store.dispatch(new CastlePodcastAllTimeMetricsLoadAction({ filter: newFilter }));
          this.resetAllData();
        }
        // apply new filter to existing data so it's not showing stale data while loading
        this.filter = newFilter;
        if (this.episodeMetrics) {
          this.episodeMetrics = filterEpisodeMetricsPage(this.filter, this.episodeMetrics, 'downloads');
        }
        if (this.podcastMetrics) {
          this.podcastMetrics = findPodcastMetrics(this.filter, [this.podcastMetrics]);
        }
        this.buildTableData();
      }
    });

    this.allEpisodesSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      const allPodcastEpisodes = filterPodcastEpisodePage(this.filter, allEpisodes);
      if (allPodcastEpisodes) {
        this.episodes = allPodcastEpisodes;
        this.episodes.forEach(episode =>
          this.store.dispatch(new CastleEpisodeAllTimeMetricsLoadAction({episode}))
        )
        this.buildTableData();
      }
    });

    this.episodeMetricsStoreSub = this.store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      this.episodeMetrics = filterEpisodeMetricsPage(this.filter, episodeMetrics, 'downloads');
      if (this.episodeMetrics) {
        this.buildTableData();
      }
    });

    this.podcastMetricsStoreSub = this.store.select(selectPodcastMetrics).subscribe((podcastMetrics: PodcastMetricsModel[]) => {
      this.podcastMetrics = findPodcastMetrics(this.filter, podcastMetrics);
      if (this.podcastMetrics) {
        this.buildTableData();
      }
    });
  }

  resetAllData() {
    this.podcastTableData = null;
    this.episodeTableData = null;
    this.podcastMetrics = null;
    this.episodeMetrics = null;
  }

  mapPodcastData() {
    const downloads = metricsData(this.filter, this.podcastMetrics, 'downloads');
    if (downloads) {
      const expectedLength = getAmountOfIntervals(this.filter.beginDate, this.filter.endDate, this.filter.interval);
      const totalForPeriod = getTotal(downloads);
      return {
        title: 'All Episodes',
        releaseDate: '',
        color: neutralColor,
        downloads: mapMetricsToTimeseriesData(downloads),
        totalForPeriod: totalForPeriod,
        avgPerIntervalForPeriod: Math.floor(totalForPeriod / expectedLength),
        allTimeDownloads: this.podcastMetrics.allTimeDownloads,
        charted: this.podcastMetrics.charted
      };
    }
  }

  mapEpisodeData() {
    if (this.episodes && this.episodeMetrics && this.episodeMetrics.length) {
      const expectedLength = getAmountOfIntervals(this.filter.beginDate, this.filter.endDate, this.filter.interval);
      return this.episodeMetrics
        .map((epMetric) => {
          const downloads = metricsData(this.filter, epMetric, 'downloads');
          const episode = this.episodes.find(ep => ep.id === epMetric.id);
          if (episode && epMetric && downloads) {
            const totalForPeriod = getTotal(downloads);
            return {
              title: episode.title,
              publishedAt: episode.publishedAt,
              releaseDate: dateFormat.monthDateYear(episode.publishedAt),
              color: episode.color,
              id: epMetric.id,
              downloads: mapMetricsToTimeseriesData(downloads),
              totalForPeriod: totalForPeriod,
              avgPerIntervalForPeriod: Math.floor(totalForPeriod / expectedLength),
              allTimeDownloads: epMetric.allTimeDownloads,
              charted: epMetric.charted
            };
          }
        })
        .sort((a, b) => {
          return moment(new Date(b.publishedAt)).valueOf() - moment(new Date(a.publishedAt)).valueOf();
        });
    }
  }

  buildTableData() {
    if (this.podcastMetrics) {
      this.podcastTableData = this.mapPodcastData();
    } else {
      this.podcastTableData = null;
    }
    if (this.episodeMetrics) {
      this.episodeTableData = this.mapEpisodeData();
    } else {
      this.episodeTableData = null;
    }
    if (this.podcastTableData && this.podcastTableData['downloads']) {
      this.dateRange = this.podcastTableData['downloads'].map(d => this.dateFormat(new Date(d.date)));
    }
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.allEpisodesSub) { this.allEpisodesSub.unsubscribe(); }
    if (this.episodeMetricsStoreSub) { this.episodeMetricsStoreSub.unsubscribe(); }
    if (this.podcastMetricsStoreSub) { this.podcastMetricsStoreSub.unsubscribe(); }
  }

  dateFormat(date: Date): string {
    if (this.filter) {
      switch (this.filter.interval) {
        case INTERVAL_MONTHLY:
          return dateFormat.monthYear(date);
        case INTERVAL_WEEKLY:
        case INTERVAL_DAILY:
          return dateFormat.monthDate(date);
        case INTERVAL_HOURLY:
          return dateFormat.hourly(date).split(', ').join(',\n');
        default:
          return dateFormat.monthDate(date);
      }
    } else {
      return dateFormat.monthDate(date);
    }
  }

  get showPodcastToggle(): boolean {
    return this.filter && this.filter.chartType === CHARTTYPE_STACKED;
  }

  get showEpisodeToggles(): boolean {
    return this.filter && this.filter.chartType !== CHARTTYPE_PODCAST;
  }

  toggleChartPodcast(charted: boolean) {
    this.podcastChartToggle.emit(charted);
  }

  toggleChartEpisode(episode, charted) {
    this.episodeChartToggle.emit({id: episode.id, charted});
  }

  onChartSingleEpisode(episode) {
    this.chartSingleEpisode.emit(episode.id);
  }

  toggleExpandedReport() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'table-expand'}));
    }
  }
}
