import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { EpisodeMetricsModel, EpisodeModel, FilterModel, PodcastMetricsModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../ngrx/model';
import { selectEpisodes, selectFilter, selectEpisodeMetrics, selectPodcastMetrics } from '../ngrx/reducers';
import { filterPodcastMetrics, filterAllPodcastEpisodes, filterEpisodeMetrics, metricsData, getTotal } from '../shared/util/metrics.util';
import { mapMetricsToTimeseriesData, dayMonthDate, hourlyDateFormat } from '../shared/util/chart.util';
import * as moment from 'moment';

@Component({
  selector: 'metrics-downloads-table',
  template: `
    <div class="table-wrapper">
      <table *ngIf="podcastTableData">
        <thead>
          <tr>
            <th class="sticky">Episode</th>
            <th>Release Date</th>
            <th>Total for Period</th>
            <th *ngFor="let date of dateRange">{{date}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="sticky">{{podcastTableData.title}}</td>
            <td>{{podcastTableData.releaseDate}}</td>
            <td>{{podcastTableData.totalForPeriod}}</td>
            <td *ngFor="let download of podcastTableData.downloads">{{download.value}}</td>
          </tr>
        </tbody>
          <tr *ngFor="let episode of episodeTableData">
            <td class="sticky">{{episode.title}}</td>
            <td>{{episode.releaseDate}}</td>
            <td>{{episode.totalForPeriod}}</td>
            <td *ngFor="let download of episode.downloads">{{download.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['downloads-table.component.css']

})
export class DownloadsTableComponent implements OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  allEpisodesSub: Subscription;
  episodes: EpisodeModel[];
  episodeMetricsStoreSub: Subscription;
  episodeMetrics: EpisodeMetricsModel[];
  podcastMetricsStoreSub: Subscription;
  podcastMetrics: PodcastMetricsModel;
  podcastTableData: {};
  episodeTableData: any[];
  dateRange: string[];

  constructor(public store: Store<any>) {

    this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter) {
        if (this.isPodcastChanged(newFilter)) {
          this.resetAllData();
        }
        if (this.isEpisodesChanged(newFilter)) {
          this.episodeMetrics = filterEpisodeMetrics(newFilter, this.episodeMetrics, 'downloads');
        }
        this.filter = newFilter;
        this.buildTableData();
      }
    });

    this.allEpisodesSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      const allPodcastEpisodes = filterAllPodcastEpisodes(this.filter, allEpisodes);
      if (allPodcastEpisodes) {
        this.episodes = allPodcastEpisodes;
        this.buildTableData();
      }
    });

    this.episodeMetricsStoreSub = this.store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      this.episodeMetrics = filterEpisodeMetrics(this.filter, episodeMetrics, 'downloads');
      if (this.episodeMetrics) {
        this.buildTableData();
      }
    });

    this.podcastMetricsStoreSub = this.store.select(selectPodcastMetrics).subscribe((podcastMetrics: PodcastMetricsModel[]) => {
      this.podcastMetrics = filterPodcastMetrics(this.filter, podcastMetrics);
      if (this.podcastMetrics) {
        this.buildTableData();
      }
    });
  }

  resetAllData() {
    this.podcastTableData = null;
    this.episodeTableData = null;
    this.podcastMetrics = null;
    this.episodeMetrics = null;
  }

  mapPodcastData() {
    const downloads = metricsData(this.filter, this.podcastMetrics, 'downloads');
    if (downloads) {
      return {
        title: 'All Episodes',
        releaseDate: '',
        downloads: mapMetricsToTimeseriesData(downloads),
        totalForPeriod: getTotal(downloads)
      }
    }
  }

  mapEpisodeData() {
    if (this.episodes && this.episodeMetrics && this.episodeMetrics.length) {
      return this.episodeMetrics
        .map((epMetric) => {
          const downloads = metricsData(this.filter, epMetric, 'downloads');
          const episode = this.episodes.find(ep => ep.id === epMetric.id);
          if (episode && epMetric && downloads) {
            return {
              title: episode.title,
              publishedAt: episode.publishedAt,
              releaseDate: dayMonthDate(episode.publishedAt),
              id: epMetric.id,
              downloads: mapMetricsToTimeseriesData(downloads),
              totalForPeriod: getTotal(downloads)
            };
          }
        })
        .sort((a, b) => {
          return moment(new Date(b.publishedAt)).valueOf() - moment(new Date(a.publishedAt)).valueOf();
        });
    }
  }

  buildTableData() {
    if (this.podcastMetrics) {
      this.podcastTableData = this.mapPodcastData();
    }
    if (this.episodeMetrics) {
      this.episodeTableData = this.mapEpisodeData();
    }
    if (this.podcastTableData && this.podcastTableData['downloads']) {
      this.dateRange = this.podcastTableData['downloads'].map(d => this.dateFormat(new Date(d.date)));
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

  isEpisodesChanged(state: FilterModel): boolean {
    return state.episodes && (!this.filter || !this.filter.episodes ||
      state.episodes.every(episode => this.filter.episodes.map(e => e.id).indexOf(episode.id) !== -1) ||
      this.filter.episodes.every(episode => state.episodes.map(e => e.id).indexOf(episode.id) !== -1));
  }

  dateFormat(date: Date): string {
    if (this.filter && this.filter.interval) {
      switch (this.filter.interval.key) {
        case INTERVAL_DAILY.key:
          return dayMonthDate(date);
        case INTERVAL_HOURLY.key:
        case INTERVAL_15MIN.key:
          return hourlyDateFormat(date);
        default:
          return dayMonthDate(date);
      }
    } else {
      return dayMonthDate(date);
    }
  }
}
