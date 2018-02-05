import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterModel, EpisodeModel, PodcastMetricsModel, EpisodeMetricsModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY,
  CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED } from '../ngrx';
import { selectRouter, selectEpisodes, selectPodcastMetrics, selectEpisodeMetrics } from '../ngrx/reducers';
import { findPodcastMetrics, filterEpisodeMetricsPage, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets, neutralColor, standardColor } from '../shared/util/chart.util';
import * as dateFormat from '../shared/util/date/date.format';
import { largeNumberFormat } from '../shared/pipes/large-number.pipe';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <prx-timeseries-chart *ngIf="chartData" [type]="chartType" [stacked]="stacked" [datasets]="chartData"
                          [formatX]="dateFormat()" [formatY]="largeNumberFormat"
                          [showPoints]="showPoints" [strokeWidth]="strokeWidth"
                          [pointRadius]="pointRadius" [pointRadiusOnHover]="pointRadiusOnHover">
    </prx-timeseries-chart>
  `
})
export class DownloadsChartComponent implements OnDestroy {
  routerSub: Subscription;
  routerState: RouterModel;
  episodesSub: Subscription;
  allEpisodes: EpisodeModel[];
  podcastMetricsStoreSub: Subscription;
  podcastMetrics: PodcastMetricsModel;
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[] = [];
  episodeChartData: TimeseriesChartModel[];
  podcastChartData: TimeseriesChartModel;
  chartData: TimeseriesChartModel[];
  largeNumberFormat = largeNumberFormat;

  constructor(public store: Store<any>) {
    this.routerSub = store.select(selectRouter).subscribe((newRouterState: RouterModel) => {
      this.routerState = newRouterState;
      this.applyFilterToExistingData();
    });

    this.episodesSub = store.select(selectEpisodes).subscribe((episodes: EpisodeModel[]) => {
      this.allEpisodes = episodes;
    });

    this.podcastMetricsStoreSub = store.select(selectPodcastMetrics).subscribe((podcastMetrics: PodcastMetricsModel[]) => {
      this.updatePodcastChartData(podcastMetrics);
    });

    this.episodeMetricsStoreSub = store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      this.episodeMetrics = filterEpisodeMetricsPage(this.routerState, episodeMetrics);
      this.updateEpisodeChartData();
    });
  }

  applyFilterToExistingData() {
    if (this.podcastMetrics) {
      this.updatePodcastChartData([this.podcastMetrics]);
    }
    this.episodeMetrics = filterEpisodeMetricsPage(this.routerState, this.episodeMetrics);
    this.updateEpisodeChartData();
  }

  updatePodcastChartData(podcastMetrics: PodcastMetricsModel[]) {
    this.podcastMetrics = findPodcastMetrics(this.routerState, podcastMetrics);
    if (this.podcastMetrics) {
      this.podcastChartData = this.mapPodcastData(metricsData(this.routerState, this.podcastMetrics));
    } else {
      this.podcastChartData = null;
    }
    this.updateChartData();
  }

  updateEpisodeChartData() {
    this.episodeChartData = this.episodeMetrics
      .filter(e => e.charted)
      .sort((a: EpisodeMetricsModel, b: EpisodeMetricsModel) => {
        return getTotal(metricsData(this.routerState, b)) - getTotal(metricsData(this.routerState, a));
      })
      .map((metrics: EpisodeMetricsModel, i) => {
        const episode = this.allEpisodes.find(ep => ep.id === metrics.id);
        return this.mapEpisodeData(episode, metricsData(this.routerState, metrics));
      });

    this.updateChartData();
  }

  ngOnDestroy() {
    if (this.routerSub) { this.routerSub.unsubscribe(); }
    if (this.episodesSub) { this.episodesSub.unsubscribe(); }
    if (this.podcastMetricsStoreSub) { this.podcastMetricsStoreSub.unsubscribe(); }
    if (this.episodeMetricsStoreSub) { this.episodeMetricsStoreSub.unsubscribe(); }
  }

  mapEpisodeData(episode: EpisodeModel, metrics: any[][]): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: episode.title, color: episode.color };
  }

  mapPodcastData(metrics: any[][]): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: 'All Episodes',
      color: this.routerState.chartType === CHARTTYPE_PODCAST ? standardColor : neutralColor };
  }

  updateChartData() {
    if (this.routerState.beginDate && this.routerState.endDate && this.routerState.interval && this.routerState.chartType) {
      this.chartData = null;
      switch (this.routerState.chartType) {
        case CHARTTYPE_STACKED:
          if (this.podcastChartData && this.podcastMetrics.charted &&
            (this.episodeChartData && this.episodeChartData.length > 0)) {
            // if we have episodes to combine with podcast total
            const episodeDatasets = this.episodeChartData.map(m => m.data);
            const allOtherEpisodesData: TimeseriesChartModel = {
              data: subtractTimeseriesDatasets(this.podcastChartData.data, episodeDatasets),
              label: 'All Other Episodes',
              color: neutralColor
            };
            this.chartData = [...this.episodeChartData, allOtherEpisodesData];
          } else if (this.podcastChartData && this.podcastMetrics.charted &&
            this.podcastChartData.data.length > 0 && this.episodeChartData.length === 0) {
            this.chartData = [this.podcastChartData];
          } else if (this.episodeChartData && this.episodeChartData.length > 0) {
            this.chartData = this.episodeChartData;
          }
          break;
        case CHARTTYPE_PODCAST:
          if (this.podcastMetrics && this.podcastChartData && this.podcastChartData.data.length > 0) {
            this.chartData = [this.podcastChartData];
          }
          break;
        case CHARTTYPE_EPISODES:
          if (this.episodeChartData && this.episodeChartData.length > 0) {
            this.chartData = this.episodeChartData;
          }
          break;
      }
    }
  }

  dateFormat(): Function {
    if (this.routerState) {
      switch (this.routerState.interval) {
        case INTERVAL_MONTHLY:
          return dateFormat.monthDateYear;
        case INTERVAL_WEEKLY:
        case INTERVAL_DAILY:
          return dateFormat.monthDate;
        case INTERVAL_HOURLY:
          return dateFormat.hourly;
        default:
          return dateFormat.UTCString;
      }
    } else {
      return dateFormat.UTCString;
    }
  }

  get chartType(): string {
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
      case CHARTTYPE_EPISODES:
        return 'line';
      case CHARTTYPE_STACKED:
        if (this.chartData && this.chartData.length && this.chartData[0].data.length < 4) {
          return 'bar';
        } else {
          return 'area';
        }
    }
  }

  get stacked(): boolean {
    return this.routerState.chartType === CHARTTYPE_STACKED;
  }

  get showPoints(): boolean {
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
      case CHARTTYPE_EPISODES:
        return true;
      case CHARTTYPE_STACKED:
        return false;
    }
  }

  get strokeWidth(): number {
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
        return 3;
      case CHARTTYPE_EPISODES:
        return 2.5;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get pointRadius(): number{
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
        return this.chartData && this.chartData.length && this.chartData[0].data.length <= 40 ? 3.75 : 0;
        // return 3.75;
      case CHARTTYPE_EPISODES:
        return this.chartData && this.chartData.length && this.chartData[0].data.length <= 20 ? 3.25 : 0;
        // return 3.25;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get pointRadiusOnHover(): number{
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
        return 3.75;
      case CHARTTYPE_EPISODES:
        return 3.25;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }
}
