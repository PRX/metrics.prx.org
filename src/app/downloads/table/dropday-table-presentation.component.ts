import { Component, Input } from '@angular/core';
import { RouterParams, DownloadsTableModel } from '@app/ngrx';

@Component({
  selector: 'metrics-dropday-table-presentation',
  template: `
    <metrics-downloads-summary-table
      [chartType]="routerParams?.chartType"
      [episodeTableData]="episodeTableData">
    </metrics-downloads-summary-table>
  `
})
export class DropdayTablePresentationComponent {
  @Input() episodeTableData: DownloadsTableModel[];
  @Input() routerParams: RouterParams;
}
