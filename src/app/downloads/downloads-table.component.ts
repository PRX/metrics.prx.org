import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
// import { Subscription } from 'rxjs/Subscription';
// import { TimeseriesChartModel } from 'ngx-prx-styleguide';
// import { EpisodeMetricsModel, PodcastMetricsModel, EpisodeModel, FilterModel,
//   INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../ngrx/model';
// import { selectFilter, selectPodcastMetrics, selectEpisodeMetrics } from '../ngrx/reducers';
// import { filterPodcastMetrics, filterEpisodeMetrics, metricsData, getTotal } from '../shared/util/metrics.util';
// import { mapMetricsToTimeseriesData, subtractTimeseriesDatasets,
//   UTCDateFormat, dailyDateFormat, hourlyDateFormat, neutralColor, generateShades } from '../shared/util/chart.util';

@Component({
  selector: 'metrics-downloads-table',
  template: `
    <h1>Downloads table goes here!
    </h1>
  `
})
export class DownloadsTableComponent implements OnDestroy {

  constructor(public store: Store<any>) {
    // this.filterStoreSub = store.select(selectFilter).subscribe((newFilter: FilterModel) => {
    //   if (this.isPodcastChanged(newFilter)) {
    //     // reset episode metrics if the filtered podcast changes
    //     this.episodeChartData = [];
    //   }
    //   // this bit picks up changes when episodes are removed from the filter
    //   if (this.isEpisodesChanged(newFilter)) {
    //     this.episodeMetrics = filterEpisodeMetrics(newFilter, this.episodeMetrics, 'downloads');
    //     this.buildEpisodeMetrics(newFilter);
    //   }
    //   this.filter = newFilter;
    // });
    //
    // this.podcastMetricsStoreSub = store.select(selectPodcastMetrics).subscribe((podcastMetrics: PodcastMetricsModel[]) => {
    //   this.podcastMetrics = filterPodcastMetrics(this.filter, podcastMetrics);
    //   if (this.podcastMetrics) {
    //     this.podcastChartData = this.mapPodcastData(metricsData(this.filter, this.podcastMetrics, 'downloads'));
    //     this.updateChartData();
    //   }
    // });
    //
    // if (!this.episodeMetricsStoreSub) {
    //   this.episodeMetricsStoreSub = store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
    //     this.episodeMetrics = filterEpisodeMetrics(this.filter, episodeMetrics, 'downloads');
    //     this.buildEpisodeMetrics(this.filter);
    //   });
    // }
  }

  // buildEpisodeMetrics(filter: FilterModel) {
  //   if (this.episodeMetrics) {
  //     this.colors = generateShades(this.episodeMetrics.length);
  //     this.episodeChartData = this.episodeMetrics
  //       .sort((a: EpisodeMetricsModel, b: EpisodeMetricsModel) => {
  //         return getTotal(metricsData(filter, b, 'downloads')) - getTotal(metricsData(filter, a, 'downloads'));
  //       })
  //       .map((metrics: EpisodeMetricsModel, i) => {
  //         const episode = filter.episodes.find(ep => ep.id === metrics.id);
  //         return this.mapEpisodeData(episode, metricsData(filter, metrics, 'downloads'), this.colors[i]);
  //       });
  //
  //     this.updateChartData();
  //   }
  // }

  ngOnDestroy() {
    // if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    // if (this.podcastMetricsStoreSub) { this.podcastMetricsStoreSub.unsubscribe(); }
    // if (this.episodeMetricsStoreSub) { this.episodeMetricsStoreSub.unsubscribe(); }
  }

  // isPodcastChanged(state: FilterModel): boolean {
  //   return state.podcast && (!this.filter || !this.filter.podcast ||  this.filter.podcast.seriesId !== state.podcast.seriesId);
  // }

  // isEpisodesChanged(state: FilterModel): boolean {
  //   return state.episodes && (!this.filter || !this.filter.episodes ||
  //     state.episodes.every(episode => this.filter.episodes.map(e => e.id).indexOf(episode.id) !== -1) ||
  //     this.filter.episodes.every(episode => state.episodes.map(e => e.id).indexOf(episode.id) !== -1));
  // }

  // mapEpisodeData(episode: EpisodeModel, metrics: any[][], color: string): TimeseriesChartModel {
  //   return { data: mapMetricsToTimeseriesData(metrics), label: episode.title, color };
  // }
  //
  // mapPodcastData(metrics: any[][]): TimeseriesChartModel {
  //   return { data: mapMetricsToTimeseriesData(metrics), label: 'All Episodes', color: neutralColor };
  // }

  // dateFormat(): Function {
  //   if (this.filter && this.filter.interval) {
  //     switch (this.filter.interval.key) {
  //       case INTERVAL_DAILY.key:
  //         return dailyDateFormat;
  //       case INTERVAL_HOURLY.key:
  //       case INTERVAL_15MIN.key:
  //         return hourlyDateFormat;
  //       default:
  //         return UTCDateFormat;
  //     }
  //   } else {
  //     return UTCDateFormat;
  //   }
  // }
}
