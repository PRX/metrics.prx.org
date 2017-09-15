import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, PodcastModel, FilterModel } from '../ngrx/model';
import { TimeseriesChartModel, TimeseriesDatumModel } from 'ngx-prx-styleguide';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <prx-timeseries-chart type="area" stacked="true" [datasets]="chartData" formatX="%m/%d"></prx-timeseries-chart>
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
  // TODO: expand color support for more datasets
  // --> episode selection
  colors = ['#000044', '#2C2C68', '#59598C', '#8686B0', '#B3B3D4'];

  constructor(public store: Store<any>) {
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
              this.podcastChartData = this.mapPodcastData(this.filter.podcast, this.podcastMetrics[0][metricsProperty + 'Others']);
              if (this.episodeChartData && this.episodeChartData.length > 0) {
                this.chartData = [...this.episodeChartData, this.podcastChartData];
              } else {
                this.chartData = [this.podcastChartData];
              }
            }
          });
        }

        if (this.filter.episodes) {
          if (!this.episodeMetricsStore) {
            this.episodeMetricsStore = this.store.select('episodeMetrics');
            this.episodeMetricsStore.subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
              this.episodeMetrics = episodeMetrics.filter((em: EpisodeMetricsModel) => {
                return em.seriesId === this.filter.podcast.seriesId &&
                  this.filter.episodes && this.filter.episodes.map(ef => ef.id).indexOf(em.id) !== -1;
              });
              if (this.episodeMetrics && this.episodeMetrics.length > 0) {
                this.episodeChartData = this.episodeMetrics.map((episodeData: EpisodeMetricsModel) => {
                  const episode = this.filter.episodes.find(e => e.seriesId === episodeData.seriesId && e.id === episodeData.id);
                  return this.mapEpisodeData(episode, episodeData[metricsProperty]);
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
                // TODO: can colors be optional to allow C3 to select colors
                // TODO: chart component should not include color in C3 config when dataset is empty
                // --> create styleguide tickets
                for (let i = 0; i < this.episodeChartData.length; i++) {
                  this.episodeChartData[i].color = this.colors[i];
                }
                if (this.podcastChartData) {
                  this.chartData = [...this.episodeChartData, this.podcastChartData];
                } else {
                  this.chartData = [...this.episodeChartData];
                }
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
    // this color is temporary and will be re-applied after sorting of the totals
    return { data: this.mapData(metrics), label: episode.title, color: '#000044' };
  }

  mapPodcastData(episode: PodcastModel, metrics: any[][]): TimeseriesChartModel {
    return { data: this.mapData(metrics), label: episode.title, color: '#a3a3a3' };
  }
}
