import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { TimeseriesChartModel, TimeseriesDatumModel } from 'ngx-prx-styleguide';
import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, FilterModel } from '../ngrx/model';
import { selectFilter, selectPodcastMetrics, selectEpisodeMetrics,
  filterPodcastMetrics, filterEpisodeMetrics, metricsData } from '../ngrx/reducers/reducers';
import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets } from '../shared/util/chart.util';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <prx-timeseries-chart type="area" stacked="true" [datasets]="chartData" [formatX]="dateFormat"></prx-timeseries-chart>
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
  // TODO: expand color support for more datasets
  // --> episode selection
  colors = ['#000044', '#2C2C68', '#59598C', '#8686B0', '#B3B3D4'];

  constructor(public store: Store<any>) {
    this.filterStoreSub = store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter.podcast) {
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
              this.episodeMetrics = filterEpisodeMetrics(this.filter, episodeMetrics);
              if (this.episodeMetrics && this.episodeMetrics.length > 0) {
                this.episodeChartData = [];
                this.episodeMetrics.forEach((metrics: EpisodeMetricsModel) => {
                  const episode = this.filter.episodes.find(ep => ep.id === metrics.id);
                  const data = metricsData(this.filter, metrics, 'downloads');
                  if (data) {
                    this.episodeChartData.push(this.mapEpisodeData(episode, data));
                  }
                });
                // TODO: can't really hide this sort by total and getting colors in here, will also need it for the table
                // sort these episodes by their data total for the stacked chart
                this.episodeChartData.sort((a: TimeseriesChartModel, b: TimeseriesChartModel) => {
                  const getTotal = (data: TimeseriesDatumModel[]) => {
                    if (data.length > 0) {
                      return data.map(d => d.value).reduce((total: number, value: number) => {
                        return total + value;
                      });
                    } else {
                      return 0;
                    }
                  };
                  return getTotal(b.data) - getTotal(a.data);
                });
                // set the colors now that they are ordered
                // TODO: can colors be optional to allow C3 to select colors?
                // TODO: chart component should not include color in C3 config when dataset is empty
                // --> create styleguide tickets
                for (let i = 0; i < this.episodeChartData.length; i++) {
                  this.episodeChartData[i].color = this.colors[i];
                }

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

  mapEpisodeData(episode: EpisodeModel, metrics: any[][]): TimeseriesChartModel {
    // this color is temporary and will be re-applied after sorting of the totals
    return { data: mapMetricsToTimeseriesData(metrics), label: episode.title, color: '#000044' };
  }

  mapPodcastData(metrics: any[][]): TimeseriesChartModel {
    return { data: mapMetricsToTimeseriesData(metrics), label: 'All Episodes', color: '#a3a3a3' };
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
        color: '#a3a3a3'
      };
      this.chartData = [...this.episodeChartData, allOtherEpisodesData];
    } else if (this.podcastChartData && this.podcastChartData.data.length > 0) {
      this.chartData = [this.podcastChartData];
    }
  }

  dateFormat(date: Date) {
    const dayOfWeek = (day: number): string => {
      switch (day) {
        case 0:
          return 'Sun';
        case 1:
          return 'Mon';
        case 2:
          return 'Tue';
        case 3:
          return 'Wed';
        case 4:
          return 'Thu';
        case 5:
          return 'Fri';
        case 6:
          return 'Sat';
      }
    };
    return dayOfWeek(date.getUTCDay()) + ' ' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
  }
}
