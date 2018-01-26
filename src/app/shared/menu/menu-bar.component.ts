import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { selectRouter, selectChartTypeRoute, selectIntervalRoute, selectStandardRangeRoute } from '../../ngrx/reducers';
import { RouterModel, IntervalModel, ChartType } from '../../ngrx';

@Component({
  selector: 'metrics-menu-bar',
  template: `
    <div class="menu-bar">
      <metrics-chart-type [selectedChartType]="chartType$ | async"></metrics-chart-type>
      <metrics-interval-dropdown [routerState]="routerState$ | async"></metrics-interval-dropdown>
      <div class="empty"></div>
      <metrics-standard-date-range-dropdown [interval]="interval$ | async" [standardRange]="standardRange$ | async"
                                            (custom)="custom.toggleOpen()"></metrics-standard-date-range-dropdown>
      <metrics-custom-date-range-dropdown [routerState]="routerState$ | async" #custom></metrics-custom-date-range-dropdown>
    </div>
    <div class="summary">
      <metrics-date-range-summary [routerState]="routerState$ | async"></metrics-date-range-summary>
      <metrics-downloads-summary></metrics-downloads-summary>
    </div>
  `,
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
  routerState$: Observable<RouterModel>;
  chartType$: Observable<ChartType>;
  interval$: Observable<IntervalModel>;
  standardRange$: Observable<string>;

  constructor(private store: Store<any>) {
    this.routerState$ = this.store.select(selectRouter);
    this.chartType$ = this.store.select(selectChartTypeRoute);
    this.interval$ = this.store.select(selectIntervalRoute);
    this.standardRange$ = this.store.select(selectStandardRangeRoute);
  }
}
