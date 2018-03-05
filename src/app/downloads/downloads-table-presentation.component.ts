import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY,
  CHARTTYPE_PODCAST, CHARTTYPE_STACKED  } from '../ngrx';
import { DownloadsTableModel } from '../ngrx/reducers/selectors/downloads-table.selectors';
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
  @Input() routerState: RouterModel;
  @Input() expanded = false;
  @Output() toggleChartPodcast = new EventEmitter<boolean>();
  @Output() toggleChartEpisode = new EventEmitter<{episodeId: number, charted: boolean}>();
  @Output() chartSingleEpisode = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() toggleExpandedReport = new EventEmitter();
  bindToIntervalHourly = INTERVAL_HOURLY;

  dateFormat(date: Date): string {
    if (this.routerState) {
      switch (this.routerState.interval) {
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
    return this.routerState && this.routerState.chartType === CHARTTYPE_STACKED;
  }

  get showEpisodeToggles(): boolean {
    return this.routerState && this.routerState.chartType !== CHARTTYPE_PODCAST;
  }
}
