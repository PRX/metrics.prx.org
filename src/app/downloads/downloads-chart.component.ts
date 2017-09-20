import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, PodcastModel, FilterModel } from '../ngrx/model';
import { TimeseriesChartModel, TimeseriesDatumModel } from 'ngx-prx-styleguide';

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
  podcastMetrics: PodcastMetricsModel[];
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[];
  episodeChartData: TimeseriesChartModel[];
  podcastChartData: TimeseriesChartModel;
  chartData: TimeseriesChartModel[];
  // TODO: expand color support for more datasets
  // --> episode selection
  colors = ['#000044', '#2C2C68', '#59598C', '#8686B0', '#B3B3D4'];

  constructor(public store: Store<any>) {
    this.filterStoreSub = store.select('filter').subscribe((state: FilterModel) => {
      if (state.podcast) {
        this.filter = state;
        const metricsProperty = this.filter.interval.key + 'Downloads';

        if (!this.podcastMetricsStoreSub) {
          this.podcastMetricsStoreSub = store.select('podcastMetrics').subscribe((podcastMetrics: PodcastMetricsModel[]) => {
            this.podcastMetrics = podcastMetrics.filter((p: PodcastMetricsModel) => p.seriesId === this.filter.podcast.seriesId);
            if (this.podcastMetrics.length > 0) {
              this.podcastChartData = this.mapPodcastData(this.podcastMetrics[0][metricsProperty + 'Others']);
              if (this.episodeChartData && this.episodeChartData.length > 0) {
                this.chartData = [...this.episodeChartData, this.podcastChartData];
              } else {
                this.chartData = [this.podcastChartData];
              }
            }
          });
        }

        if (this.filter.episodes) {
          if (!this.episodeMetricsStoreSub) {
            this.episodeMetricsStoreSub = store.select('episodeMetrics').subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
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

  ngOnDestroy() {
    this.filterStoreSub.unsubscribe();
    this.podcastMetricsStoreSub.unsubscribe();
    this.episodeMetricsStoreSub.unsubscribe();
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

  mapPodcastData(metrics: any[][]): TimeseriesChartModel {
    const label = this.episodeChartData ? 'All Other Episodes' : 'All Episodes';
    return { data: this.mapData(metrics), label, color: '#a3a3a3' };
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
