import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
// import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { EpisodeMetricsModel, EpisodeModel, FilterModel } from '../ngrx/model'; // PodcastMetricsModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN
import { selectEpisodes, selectFilter, selectEpisodeMetrics } from '../ngrx/reducers'; //selectPodcastMetrics,
import { filterPodcastMetrics, filterAllPodcastEpisodes, filterEpisodeMetrics, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, dayMonthDate } from '../shared/util/chart.util'; // , subtractTimeseriesDatasets, UTCDateFormat, dailyDateFormat, hourlyDateFormat, neutralColor, generateShades }
import * as moment from 'moment';


@Component({
  selector: 'metrics-downloads-table',
  template: `
    <table *ngIf="episodeTableData">
      <thead>
        <tr>
          <th>Episode</th>
          <th>Release Date</th>
          <th>Total for period</th>
          <th *ngFor="let date of dateRange">{{date}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let episode of episodeTableData">
          <td>{{episode.title}}</td>
          <td>{{episode.publishedAt}}</td>
          <td>{{episode.totalForPeriod}}</td>
          <td *ngFor="let download of episode.downloads">{{download.value}}</td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['downloads-table.component.css']

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
              publishedAt: dayMonthDate(episode.publishedAt),
              id: epMetric.id,
              downloads: mapMetricsToTimeseriesData(epMetric.downloads),
              totalForPeriod: getTotal(epMetric.downloads)
            };
          }
        })
        .sort((a, b) => {
          return moment(b.publishedAt).valueOf() - moment(a.publishedAt).valueOf();
        });
      this.setTableDates();
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

  setTableDates() {
    if (this.episodeTableData) {
      this.dateRange = this.episodeTableData[0].downloads.map(d => dayMonthDate(new Date(d.date)));
    }
  }
}
