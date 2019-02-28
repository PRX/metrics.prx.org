import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectRouter,
  selectMetricsTypeRoute,
  selectChartTypeRoute,
  selectIntervalRoute,
  selectStandardRangeRoute
} from '../../ngrx/reducers/selectors';
import { RouterParams, IntervalModel, MetricsType, ChartType, METRICSTYPE_DOWNLOADS } from '../../ngrx';

@Component({
  selector: 'metrics-menu-bar',
  template: `
    <div class="menu-bar">
      <metrics-type-heading [routerParams]="routerParams$ | async"></metrics-type-heading>
      <div class="menu-dropdowns">
        <metrics-export-dropdown></metrics-export-dropdown>
        <div class="separator"></div>
        <metrics-episode-select *ngIf="(metricsType$ | async) !== downloads"></metrics-episode-select>
        <div class="separator" *ngIf="(metricsType$ | async) !== downloads"></div>
        <metrics-interval-dropdown [routerParams]="routerParams$ | async"></metrics-interval-dropdown>
        <div class="separator"></div>
        <metrics-standard-date-range-dropdown [interval]="interval$ | async" [standardRange]="standardRange$ | async">
        </metrics-standard-date-range-dropdown>
        <metrics-custom-date-range-dropdown [routerParams]="routerParams$ | async"></metrics-custom-date-range-dropdown>
      </div>
    </div>
    <div class="summary">
      <metrics-downloads-summary></metrics-downloads-summary>
      <div>
        <metrics-chart-type [selectedChartType]="chartType$ | async" [metricsType]="metricsType$ | async"></metrics-chart-type>
      </div>
    </div>
  `,
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
  routerParams$: Observable<RouterParams>;
  metricsType$: Observable<MetricsType>;
  chartType$: Observable<ChartType>;
  interval$: Observable<IntervalModel>;
  standardRange$: Observable<string>;
  downloads = METRICSTYPE_DOWNLOADS;

  constructor(private store: Store<any>) {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.metricsType$ = this.store.pipe(select(selectMetricsTypeRoute));
    this.chartType$ = this.store.pipe(select(selectChartTypeRoute));
    this.interval$ = this.store.pipe(select(selectIntervalRoute));
    this.standardRange$ = this.store.pipe(select(selectStandardRangeRoute));
  }
}
