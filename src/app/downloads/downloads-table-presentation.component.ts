import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterParams, DownloadsTableModel, INTERVAL_HOURLY,
  CHARTTYPE_PODCAST, CHARTTYPE_STACKED } from '../ngrx';
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
  @Input() intervalData: any[][];
  @Input() routerParams: RouterParams;
  @Input() expanded = false;
  @Output() toggleChartPodcast = new EventEmitter<{id: string, charted: boolean}>();
  @Output() toggleChartEpisode = new EventEmitter<{episodeId: string, charted: boolean}>();
  @Output() chartSingleEpisode = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() toggleExpandedReport = new EventEmitter();

  releaseDateFormat(date: Date): string {
    return dateFormat.monthDateYear(date);
  }

  get showPodcastToggle(): boolean {
    return this.routerParams && this.routerParams.chartType === CHARTTYPE_STACKED;
  }

  get showEpisodeToggles(): boolean {
    return this.routerParams && this.routerParams.chartType !== CHARTTYPE_PODCAST;
  }

  get isHourly(): boolean {
    return this.routerParams && this.routerParams.interval === INTERVAL_HOURLY;
  }
}
