import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, FilterModel,
  INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../ngrx/model';
import { selectFilter, selectPodcastMetrics, selectEpisodeMetrics } from '../ngrx/reducers';
import { findPodcastMetrics, filterEpisodeMetrics, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets,
  UTCDateFormat, dailyDateFormat, hourlyDateFormat, neutralColor, generateShades } from '../shared/util/chart.util';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <prx-timeseries-chart *ngIf="chartData" type="area" stacked="true" [datasets]="chartData" [formatX]="dateFormat()">
    </prx-timeseries-chart>
  `
})
export class DownloadsChartComponent implements OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  podcastMetricsStoreSub: Subscription;
  podcastMetrics: PodcastMetricsModel;
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[] = [];
  episodeChartData: TimeseriesChartModel[];
  podcastChartData: TimeseriesChartModel;
  chartData: TimeseriesChartModel[];
  colors: string[];

  constructor(public store: Store<any>) {
    this.filterStoreSub = store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      this.filter = newFilter;
      this.applyFilterToExistingData();
    });

    this.podcastMetricsStoreSub = store.select(selectPodcastMetrics).subscribe((podcastMetrics: PodcastMetricsModel[]) => {
      this.updatePodcastChartData(podcastMetrics);
    });

    if (!this.episodeMetricsStoreSub) {
      this.episodeMetricsStoreSub = store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
        this.episodeMetrics = filterEpisodeMetrics(this.filter, episodeMetrics, 'downloads');
        this.updateEpisodeChartData();
      });
    }
  }

  applyFilterToExistingData() {
    if (this.podcastMetrics) {
      this.updatePodcastChartData([this.podcastMetrics]);
    }
    this.episodeMetrics = filterEpisodeMetrics(this.filter, this.episodeMetrics, 'downloads');
    this.updateEpisodeChartData();
  }

  updatePodcastChartData(podcastMetrics: PodcastMetricsModel[]) {
    this.podcastMetrics = findPodcastMetrics(this.filter, podcastMetrics);
    if (this.podcastMetrics) {
      this.podcastChartData = this.mapPodcastData(metricsData(this.filter, this.podcastMetrics, 'downloads'));
      this.updateChartData();
    } else {
      this.podcastChartData = null;
    }
  }

  updateEpisodeChartData() {
    this.colors = generateShades(this.episodeMetrics.length);
    this.episodeChartData = this.episodeMetrics
      .sort((a: EpisodeMetricsModel, b: EpisodeMetricsModel) => {
        return getTotal(metricsData(this.filter, b, 'downloads')) - getTotal(metricsData(this.filter, a, 'downloads'));
      })
      .map((metrics: EpisodeMetricsModel, i) => {
        const episode = this.filter.episodes.find(ep => ep.id === metrics.id);
        return this.mapEpisodeData(episode, metricsData(this.filter, metrics, 'downloads'), this.colors[i]);
      });

    this.updateChartData();
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.podcastMetricsStoreSub) { this.podcastMetricsStoreSub.unsubscribe(); }
    if (this.episodeMetricsStoreSub) { this.episodeMetricsStoreSub.unsubscribe(); }
  }

  mapEpisodeData(episode: EpisodeModel, metrics: any[][], color: string): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: episode.title, color };
  }

  mapPodcastData(metrics: any[][]): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: 'All Episodes', color: neutralColor };
  }

  updateChartData() {
    if (this.podcastChartData && this.podcastChartData.data.length > 0 &&
      this.episodeChartData && this.episodeChartData.length > 0 &&
      this.episodeChartData.every(chartData => chartData.data.length === this.podcastChartData.data.length)) {
      // if we have episodes to combine with podcast total
      const episodeDatasets = this.episodeChartData.map(m => m.data);
      const allOtherEpisodesData: TimeseriesChartModel = {
        data: subtractTimeseriesDatasets(this.podcastChartData.data, episodeDatasets),
        label: 'All Other Episodes',
        color: neutralColor
      };
      this.chartData = [...this.episodeChartData, allOtherEpisodesData];
    } else if (this.podcastChartData && this.podcastChartData.data.length > 0) {
      this.chartData = [this.podcastChartData];
    } else {
      this.chartData = null;
    }
  }

  dateFormat(): Function {
    if (this.filter && this.filter.interval) {
      switch (this.filter.interval.key) {
        case INTERVAL_DAILY.key:
          return dailyDateFormat;
        case INTERVAL_HOURLY.key:
        case INTERVAL_15MIN.key:
          return hourlyDateFormat;
        default:
          return UTCDateFormat;
      }
    } else {
      return UTCDateFormat;
    }
  }
}
