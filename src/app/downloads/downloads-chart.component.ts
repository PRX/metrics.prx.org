import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { FilterModel, EpisodeModel, PodcastMetricsModel, EpisodeMetricsModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../ngrx';
import { selectFilter, selectEpisodes, selectPodcastMetrics, selectEpisodeMetrics } from '../ngrx/reducers';
import { findPodcastMetrics, filterEpisodeMetricsPage, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, neutralColor } from '../shared/util/chart.util';
import { UTCDateFormat, monthYearFormat, dayMonthDateFormat, hourlyDateFormat, getAmountOfIntervals } from '../shared/util/date.util';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <prx-timeseries-chart *ngIf="chartData" [type]="chartType" stacked="true" [datasets]="chartData" [formatX]="dateFormat()">
    </prx-timeseries-chart>
  `
})
export class DownloadsChartComponent implements OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  episodesSub: Subscription;
  allEpisodes: EpisodeModel[];
  podcastMetricsStoreSub: Subscription;
  podcastMetrics: PodcastMetricsModel;
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[] = [];
  episodeChartData: TimeseriesChartModel[];
  podcastChartData: TimeseriesChartModel;
  chartData: TimeseriesChartModel[];

  constructor(public store: Store<any>) {
    this.filterStoreSub = store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      this.filter = newFilter;
      this.applyFilterToExistingData();
    });

    this.episodesSub = store.select(selectEpisodes).subscribe((episodes: EpisodeModel[]) => {
      this.allEpisodes = episodes;
    });

    this.podcastMetricsStoreSub = store.select(selectPodcastMetrics).subscribe((podcastMetrics: PodcastMetricsModel[]) => {
      this.updatePodcastChartData(podcastMetrics);
    });

    this.episodeMetricsStoreSub = store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      this.episodeMetrics = filterEpisodeMetricsPage(this.filter, episodeMetrics, 'downloads');
      this.updateEpisodeChartData();
    });
  }

  applyFilterToExistingData() {
    if (this.podcastMetrics) {
      this.updatePodcastChartData([this.podcastMetrics]);
    }
    this.episodeMetrics = filterEpisodeMetricsPage(this.filter, this.episodeMetrics, 'downloads');
    this.updateEpisodeChartData();
  }

  updatePodcastChartData(podcastMetrics: PodcastMetricsModel[]) {
    this.podcastMetrics = findPodcastMetrics(this.filter, podcastMetrics);
    if (this.podcastMetrics && this.podcastMetrics.charted) {
      this.podcastChartData = this.mapPodcastData(metricsData(this.filter, this.podcastMetrics, 'downloads'));
    } else {
      this.podcastChartData = null;
    }
    this.updateChartData();
  }

  updateEpisodeChartData() {
    this.episodeChartData = this.episodeMetrics
      .filter(e => e.charted)
      .sort((a: EpisodeMetricsModel, b: EpisodeMetricsModel) => {
        return getTotal(metricsData(this.filter, b, 'downloads')) - getTotal(metricsData(this.filter, a, 'downloads'));
      })
      .map((metrics: EpisodeMetricsModel, i) => {
        const episode = this.allEpisodes.find(ep => ep.id === metrics.id);
        return this.mapEpisodeData(episode, metricsData(this.filter, metrics, 'downloads'));
      });

    this.updateChartData();
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.episodesSub) { this.episodesSub.unsubscribe(); }
    if (this.podcastMetricsStoreSub) { this.podcastMetricsStoreSub.unsubscribe(); }
    if (this.episodeMetricsStoreSub) { this.episodeMetricsStoreSub.unsubscribe(); }
  }

  mapEpisodeData(episode: EpisodeModel, metrics: any[][]): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: episode.title, color: episode.color };
  }

  mapPodcastData(metrics: any[][]): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: 'All Episodes', color: neutralColor };
  }

  updateChartData() {
    if (this.filter.beginDate && this.filter.endDate && this.filter.interval) {
      // no partial date range coverage charts, makes the loading UX too jerky
      const expectedLength = getAmountOfIntervals(this.filter.beginDate, this.filter.endDate, this.filter.interval);
      if (this.podcastChartData && this.podcastChartData.data.length === expectedLength &&
        (this.episodeChartData && this.episodeChartData.length > 0 &&
        this.episodeChartData.every(chartData => chartData.data.length === expectedLength))) {
        // if we have episodes to combine with podcast total
        const episodeDatasets = this.episodeChartData.map(m => m.data);
        const allOtherEpisodesData: TimeseriesChartModel = {
          // data: this.podcastChartData.data,
          // label: this.podcastChartData.label,
          data: subtractTimeseriesDatasets(this.podcastChartData.data, episodeDatasets),
          label: 'All Other Episodes',
          color: neutralColor
        };
        this.chartData = [...this.episodeChartData, allOtherEpisodesData];
      } else if (this.podcastMetrics && this.podcastMetrics.charted && this.podcastChartData && this.podcastChartData.data.length > 0) {
        this.chartData = [this.podcastChartData];
      } else if (this.episodeChartData && this.episodeChartData.length > 0 &&
        this.episodeChartData.every(chartData => chartData.data.length === expectedLength)) {
        this.chartData = this.episodeChartData;
      } else {
        this.chartData = null;
      }
    }
  }

  dateFormat(): Function {
    if (this.filter) {
      switch (this.filter.interval) {
        case INTERVAL_MONTHLY:
          return monthYearFormat;
        case INTERVAL_WEEKLY:
        case INTERVAL_DAILY:
          return dayMonthDateFormat;
        case INTERVAL_HOURLY:
          return hourlyDateFormat;
        default:
          return UTCDateFormat;
      }
    } else {
      return UTCDateFormat;
    }
  }

  get chartType(): string {
    if (this.chartData && this.chartData.length && this.chartData[0].data.length < 4) {
      return 'bar';
    } else {
      return 'area';
    }
  }
}
