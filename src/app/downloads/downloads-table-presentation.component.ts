import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterParams, DownloadsTableModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY,
  CHARTTYPE_PODCAST, CHARTTYPE_STACKED  } from '../ngrx';
import * as dateFormat from '../shared/util/date/date.format';

@Component({
  selector: 'metrics-downloads-table-presentation',
  templateUrl: 'downloads-table-presentation.component.html',
  styleUrls: ['downloads-table-presentation.component.css']
})
export class DownloadsTablePresentationComponent {
  @Input() totalPages: number;
  @Input() podcastTableData: DownloadsTableModel;
  @Input() episodeTableData: DownloadsTableModel[];
  @Input() routerParams: RouterParams;
  @Input() expanded = false;
  @Output() toggleChartPodcast = new EventEmitter<{id: string, charted: boolean}>();
  @Output() toggleChartEpisode = new EventEmitter<{episodeId: string, charted: boolean}>();
  @Output() chartSingleEpisode = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() toggleExpandedReport = new EventEmitter();
  bindToIntervalHourly = INTERVAL_HOURLY;

  dateFormat(date: Date): string {
    if (this.routerParams) {
      switch (this.routerParams.interval) {
        case INTERVAL_MONTHLY:
          return dateFormat.monthDateYear(date);
        case INTERVAL_WEEKLY:
        case INTERVAL_DAILY:
          return dateFormat.monthDate(date);
        case INTERVAL_HOURLY:
          return dateFormat.hourly(date).split(', ').join(',\n');
        default:
          return dateFormat.monthDate(date);
      }
    } else {
      return dateFormat.monthDate(date);
    }
  }

  releaseDateFormat(date: Date): string {
    return dateFormat.monthDateYear(date);
  }

  get dateRange(): string[] {
    const dataWithDates = this.podcastTableData ? this.podcastTableData : this.episodeTableData[0];
    return dataWithDates.downloads.map(datum => this.dateFormat(new Date(datum.date)));
  }

  get showPodcastToggle(): boolean {
    return this.routerParams && this.routerParams.chartType === CHARTTYPE_STACKED;
  }

  get showEpisodeToggles(): boolean {
    return this.routerParams && this.routerParams.chartType !== CHARTTYPE_PODCAST;
  }
}
