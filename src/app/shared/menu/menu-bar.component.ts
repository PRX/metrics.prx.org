import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectRouter, selectChartTypeRoute, selectIntervalRoute, selectStandardRangeRoute } from '../../ngrx/reducers/selectors';
import { RouterParams, IntervalModel, ChartType } from '../../ngrx';

@Component({
  selector: 'metrics-menu-bar',
  template: `
    <div class="menu-bar">
      <metrics-type-heading [routerParams]="routerParams$ | async"></metrics-type-heading>
      <div class="menu-dropdowns">
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
        <metrics-chart-type [selectedChartType]="chartType$ | async"></metrics-chart-type>
      </div>
    </div>
  `,
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
  routerParams$: Observable<RouterParams>;
  chartType$: Observable<ChartType>;
  interval$: Observable<IntervalModel>;
  standardRange$: Observable<string>;

  constructor(private store: Store<any>) {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.chartType$ = this.store.pipe(select(selectChartTypeRoute));
    this.interval$ = this.store.pipe(select(selectIntervalRoute));
    this.standardRange$ = this.store.pipe(select(selectStandardRangeRoute));
  }
}
