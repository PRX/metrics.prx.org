import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, PodcastModel, FilterModel } from '../shared';
import { TimeseriesChartModel, TimeseriesDatumModel } from 'ngx-prx-styleguide';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <prx-timeseries-chart type="line" [datasets]="chartData" formatX="%m/%d"></prx-timeseries-chart>
  `
})
export class DownloadsChartComponent {
  filterStore: Observable<FilterModel>;
  filter: FilterModel;
  podcastMetricsStore: Observable<PodcastMetricsModel[]>;
  podcastMetrics: PodcastMetricsModel[];
  episodeMetricsStore: Observable<EpisodeMetricsModel[]>;
  episodeMetrics: EpisodeMetricsModel[];
  episodeChartData: TimeseriesChartModel[];
  podcastChartData: TimeseriesChartModel;
  chartData: TimeseriesChartModel[];
  colors = ['#000044', '#2C2C68', '#59598C', '#8686B0', '#B3B3D4'];

  constructor(private store: Store<any>) {
    this.filterStore = store.select('filter');

    this.filterStore.subscribe((state: FilterModel) => {
      if (state.podcast) {
        this.filter = state;
        const metricsProperty = this.filter.interval.key + 'Downloads';

        if (!this.podcastMetricsStore) {
          this.podcastMetricsStore = this.store.select('podcastMetrics');
          this.podcastMetricsStore.subscribe((podcastMetrics: PodcastMetricsModel[]) => {
            this.podcastMetrics = podcastMetrics.filter((p: PodcastMetricsModel) => p.seriesId === this.filter.podcast.seriesId);
            if (this.podcastMetrics.length > 0) {
              this.podcastChartData = this.mapPodcastData(this.filter.podcast, this.podcastMetrics[0][metricsProperty]);
              this.chartData = this.episodeChartData && this.episodeChartData.length > 0 ?
                [...this.episodeChartData, this.podcastChartData] : [this.podcastChartData];
            }
          });
        }

        if (this.filter.episodes) {
          if (!this.episodeMetricsStore) {
            this.episodeMetricsStore = this.store.select('episodeMetrics');
            this.episodeMetricsStore.subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
              this.episodeMetrics = episodeMetrics.filter((e: EpisodeMetricsModel) => {
                return e.seriesId === this.filter.podcast.seriesId &&
                  this.filter.episodes && this.filter.episodes.map(ep => ep.id).indexOf(e.id) !== -1;
              });
              if (this.episodeMetrics && this.episodeMetrics.length > 0) {
                this.episodeChartData = this.episodeMetrics.map((episodeData: EpisodeMetricsModel) => {
                  const episode = this.filter.episodes.find(e => e.seriesId === episodeData.seriesId && e.id === episodeData.id);
                  return this.mapEpisodeData(episode, episodeData[metricsProperty]);
                });
                // sort these episode by their data total for the stacked chart
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
                for (let i = 0; i < this.episodeChartData.length; i++) {
                  this.episodeChartData[i].color = this.colors[i];
                }
                // TODO: subtract episode data from podcast data
                // TODO: sparse datasets need to be populated with zeroes for missing datetime entries
                this.chartData = this.podcastChartData ? [...this.episodeChartData, this.podcastChartData] : [...this.episodeChartData];
              }
            });
          }
        }
      }
    });
  }

  mapData(data: any): TimeseriesDatumModel[] {
    return data.map((datum: any) => {
      return { value: datum[1], date: moment(datum[0]).valueOf() };
    });
  }

  mapEpisodeData(episode: EpisodeModel, metrics: any[][]): TimeseriesChartModel {
    return { data: this.mapData(metrics), label: episode.title, color: '#000044' };
  }

  mapPodcastData(episode: PodcastModel, metrics: any[][]): TimeseriesChartModel {
    return { data: this.mapData(metrics), label: episode.title, color: '#a3a3a3' };
  }
}
