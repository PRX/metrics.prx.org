import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { TimeseriesChartModel, TimeseriesDatumModel } from 'ngx-prx-styleguide';
import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, FilterModel,
  INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../ngrx/model';
import { selectFilter, selectPodcastMetrics, selectEpisodeMetrics } from '../ngrx/reducers/reducers';
import { filterPodcastMetrics, filterEpisodeMetrics, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets,
  UTCDateFormat, dailyDateFormat, hourlyDateFormat, lightenColor } from '../shared/util/chart.util';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <prx-timeseries-chart type="area" stacked="true" [datasets]="chartData" [formatX]="dateFormat()">
    </prx-timeseries-chart>
  `
})
export class DownloadsChartComponent implements OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  podcastMetricsStoreSub: Subscription;
  podcastMetrics: PodcastMetricsModel;
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[];
  episodeChartData: TimeseriesChartModel[];
  podcastChartData: TimeseriesChartModel;
  chartData: TimeseriesChartModel[];
  baseColor = 'rgb(32, 80, 96)';
  podcastColor = '#a3a3a3';

  constructor(public store: Store<any>) {
    this.filterStoreSub = store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter.podcast) {

        if (this.isPodcastChanged(newFilter)) {
          // reset episode metrics if the filtered podcast changes
          this.episodeChartData = [];
        }
        this.filter = newFilter;

        if (!this.podcastMetricsStoreSub) {
          this.podcastMetricsStoreSub = store.select(selectPodcastMetrics).subscribe((podcastMetrics: PodcastMetricsModel[]) => {
            this.podcastMetrics = filterPodcastMetrics(this.filter, podcastMetrics);
            if (this.podcastMetrics) {
              this.podcastChartData = this.mapPodcastData(metricsData(this.filter, this.podcastMetrics, 'downloads'));
              this.updateChartData();
            }
          });
        }

        if (this.filter.episodes) {
          if (!this.episodeMetricsStoreSub) {
            this.episodeMetricsStoreSub = store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
              this.episodeMetrics = filterEpisodeMetrics(this.filter, episodeMetrics, 'downloads');
              if (this.episodeMetrics && this.episodeMetrics.length > 0) {
                this.episodeChartData = this.episodeMetrics
                  .sort((a: EpisodeMetricsModel, b: EpisodeMetricsModel) => {
                    return getTotal(metricsData(this.filter, b, 'downloads')) - getTotal(metricsData(this.filter, a, 'downloads'));
                  })
                  .map((metrics: EpisodeMetricsModel, i) => {
                    const episode = this.filter.episodes.find(ep => ep.id === metrics.id);
                    // to lighten the color almost up to 75%
                    const colorPercent = i > 0 ? 75 * i / this.episodeMetrics.length : 0;
                    return this.mapEpisodeData(episode, metricsData(this.filter, metrics, 'downloads'), colorPercent);
                  });

                this.updateChartData();
              }
            });
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.podcastMetricsStoreSub) { this.podcastMetricsStoreSub.unsubscribe(); }
    if (this.episodeMetricsStoreSub) { this.episodeMetricsStoreSub.unsubscribe(); }
  }

  isPodcastChanged(state: FilterModel): boolean {
    return state.podcast && (!this.filter || !this.filter.podcast ||  this.filter.podcast.seriesId !== state.podcast.seriesId);
  }

  mapEpisodeData(episode: EpisodeModel, metrics: any[][], colorPercent: number): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: episode.title, color: lightenColor(this.baseColor, colorPercent) };
  }

  mapPodcastData(metrics: any[][]): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: 'All Episodes', color: this.podcastColor };
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
        color: this.podcastColor
      };
      this.chartData = [...this.episodeChartData, allOtherEpisodesData];
    } else if (this.podcastChartData && this.podcastChartData.data.length > 0) {
      this.chartData = [this.podcastChartData];
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
