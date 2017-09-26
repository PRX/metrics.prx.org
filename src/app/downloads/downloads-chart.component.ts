import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, FilterModel } from '../ngrx/model';
import { subtractDatasets } from '../ngrx/reducers/metrics.util';
import { TimeseriesChartModel, TimeseriesDatumModel } from 'ngx-prx-styleguide';
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
    this.filterStoreSub = store.select('filter').subscribe((state: FilterModel) => {
      if (state.podcast) {
        this.filter = state;

        if (!this.podcastMetricsStoreSub) {
          this.podcastMetricsStoreSub = store.select('podcastMetrics').subscribe((podcastMetrics: PodcastMetricsModel[]) => {
            const data = podcastMetrics.filter((p: PodcastMetricsModel) => p.seriesId === this.filter.podcast.seriesId);
            if (data.length > 0) {
              this.podcastMetrics = data[0];
              const metricsProperty = this.filter.interval.key + 'Downloads';
              if (this.podcastMetrics[metricsProperty]) {
                this.podcastChartData = this.mapPodcastData(this.podcastMetrics[metricsProperty]);
                this.updateChartData();
              }
            }
          });
        }

        if (this.filter.episodes) {
          if (!this.episodeMetricsStoreSub) {
            this.episodeMetricsStoreSub = store.select('episodeMetrics').subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
              const metricsProperty = this.filter.interval.key + 'Downloads';
              // TODO: filter belongs in a selector
              this.episodeMetrics = episodeMetrics.filter((em: EpisodeMetricsModel) => {
                return em.seriesId === this.filter.podcast.seriesId &&
                  // one of the filtered episodes
                  this.filter.episodes && this.filter.episodes.map(ef => ef.id).indexOf(em.id) !== -1 &&
                  // has daily/hourly/etcDownloads
                  // TODO: limit this metrics array to filter's begin and end date in selector
                  em[metricsProperty];
              });
              if (this.episodeMetrics && this.episodeMetrics.length > 0) {
                this.episodeChartData = this.episodeMetrics
                  .map((episodeData: EpisodeMetricsModel) => {
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
      this.episodeChartData && this.episodeChartData.length > 0) {
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
