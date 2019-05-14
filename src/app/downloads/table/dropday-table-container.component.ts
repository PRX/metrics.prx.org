import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DownloadsTableModel, ChartType } from '@app/ngrx';
import { selectChartTypeRoute, selectDropdayTableMetrics } from '@app/ngrx/reducers/selectors';

@Component({
  selector: 'metrics-dropday-table',
  template: `
    <metrics-downloads-summary-table
      [chartType]="chartType$ | async"
      [episodeTableData]="episodeTableData$ | async">
    </metrics-downloads-summary-table>
  `
})
export class DropdayTableContainerComponent implements OnInit {
  episodeTableData$: Observable<DownloadsTableModel[]>;
  chartType$: Observable<ChartType>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.episodeTableData$ = this.store.pipe(select(selectDropdayTableMetrics));
    this.chartType$ = this.store.pipe(select(selectChartTypeRoute));
  }
}
