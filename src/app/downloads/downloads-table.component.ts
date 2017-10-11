import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
// import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { EpisodeMetricsModel, EpisodeModel, FilterModel } from '../ngrx/model'; // PodcastMetricsModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN
import { selectEpisodes, selectFilter, selectEpisodeMetrics } from '../ngrx/reducers'; //selectPodcastMetrics,
import { filterPodcastMetrics, filterAllPodcastEpisodes, filterEpisodeMetrics, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, dailyDateFormat } from '../shared/util/chart.util'; // , subtractTimeseriesDatasets, UTCDateFormat, dailyDateFormat, hourlyDateFormat, neutralColor, generateShades }
import * as moment from 'moment';


@Component({
  selector: 'metrics-downloads-table',
  template: `
    <table>
      <tr>
        <th>Episode</th>
        <th>Total for period</th>
        <th *ngFor="let date of dateRange">{{date}}</th>
      </tr>
      <tr *ngFor="let episode of episodeTableData">
        <td>{{episode.title}}</td>
        <td>{{episode.totalForPeriod}}</td>
      </tr>
    </table>

  `
})
export class DownloadsTableComponent implements OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  allEpisodesSub: Subscription;
  episodes: EpisodeModel[];
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: any[];
  episodeTableData: any[];
  dateRange: any[];


  constructor(public store: Store<any>) {

    this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter) {
        if (this.isPodcastChanged(newFilter)) {
          this.episodes = [];
        }
        this.filter = newFilter;
      }
    });

    this.allEpisodesSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      const allPodcastEpisodes = filterAllPodcastEpisodes(this.filter, allEpisodes);
      if (allPodcastEpisodes) {
        this.episodes = allPodcastEpisodes;
        this.buildEpisodeMetrics();
      }
    });

    this.episodeMetricsStoreSub = store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      const epMetrics = filterEpisodeMetrics(this.filter, episodeMetrics, 'downloads');
      if (epMetrics) {
        this.episodeMetrics = epMetrics.map(e => {
          return {
            id: e.id,
            downloads: metricsData(this.filter, e, 'downloads')
          }
        });
        this.buildEpisodeMetrics();
      }
    });
  }

  buildEpisodeMetrics() {
    if (this.episodes && this.episodeMetrics && this.episodeMetrics.length) {
      this.episodeTableData = this.episodeMetrics
        .map((epMetric) => {
          const episode = this.episodes.find(ep => ep.id === epMetric.id);
          if (episode) {
            return {
              title: episode.title,
              publishedAt: episode.publishedAt,
              id: epMetric.id,
              downloads: mapMetricsToTimeseriesData(epMetric.downloads),
              totalForPeriod: getTotal(epMetric.downloads)
            };
          }
        })
        .sort((a, b) => {
          return moment(a.publishedAt).valueOf() - moment(b.publishedAt).valueOf();
        });
      this.updateTableData();
    }
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
    if (this.allEpisodesSub) { this.allEpisodesSub.unsubscribe(); }
    if (this.episodeMetricsStoreSub) { this.episodeMetricsStoreSub.unsubscribe(); }
  }

  isPodcastChanged(state: FilterModel): boolean {
    return state.podcast && (!this.filter || !this.filter.podcast ||  this.filter.podcast.seriesId !== state.podcast.seriesId);
  }

  updateTableData() {
    if (this.episodeTableData) {
      this.dateRange = this.episodeTableData.map(e => dailyDateFormat(e.publishedAt));
    }
  }
}
