import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { EpisodeModel, FilterModel, EpisodeMetricsModel, PodcastMetricsModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../ngrx';
import { selectEpisodes, selectFilter, selectEpisodeMetrics, selectPodcastMetrics } from '../ngrx/reducers';
import { findPodcastMetrics, filterPodcastEpisodePage, filterEpisodeMetricsPage, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, neutralColor } from '../shared/util/chart.util';
import * as dateFormat from '../shared/util/date/date.format';
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

  constructor(public store: Store<any>) {

    this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter) {
        if (isPodcastChanged(newFilter, this.filter)) {
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
      return {
        title: 'All Episodes',
        releaseDate: '',
        color: neutralColor,
        downloads: mapMetricsToTimeseriesData(downloads),
        totalForPeriod: getTotal(downloads),
        charted: this.podcastMetrics.charted
      };
    }
  }

  mapEpisodeData() {
    if (this.episodes && this.episodeMetrics && this.episodeMetrics.length) {
      return this.episodeMetrics
        .map((epMetric) => {
          const downloads = metricsData(this.filter, epMetric, 'downloads');
          const episode = this.episodes.find(ep => ep.id === epMetric.id);
          if (episode && epMetric && downloads) {
            return {
              title: episode.title,
              publishedAt: episode.publishedAt,
              releaseDate: dateFormat.monthDateYear(episode.publishedAt),
              color: episode.color,
              id: epMetric.id,
              downloads: mapMetricsToTimeseriesData(downloads),
              totalForPeriod: getTotal(downloads),
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

  toggleChartPodcast(charted: boolean) {
    this.podcastChartToggle.emit(charted);
  }

  toggleChartEpisode(episode, charted) {
    this.episodeChartToggle.emit({id: episode.id, charted});
  }
}
