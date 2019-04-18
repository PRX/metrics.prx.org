import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterParams, DownloadsTableModel, INTERVAL_HOURLY } from '@app/ngrx';

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
  @Output() toggleChartPodcast = new EventEmitter<{id: string, charted: boolean}>();
  @Output() toggleChartEpisode = new EventEmitter<{episodeId: string, charted: boolean}>();
  @Output() chartSingleEpisode = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() toggleExpandedReport = new EventEmitter();
  expanded = false;

  get isHourly(): boolean {
    return this.routerParams && this.routerParams.interval === INTERVAL_HOURLY;
  }

  onToggleExpandedReport() {
    this.expanded = !this.expanded;
    this.toggleExpandedReport.emit(this.expanded);
  }
}
