import { Component, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { selectRouter, selectChartTypeRoute, selectIntervalRoute, selectStandardRangeRoute } from '../../ngrx/reducers';
import { RouterModel, IntervalModel, ChartType } from '../../ngrx';
import { GoogleAnalyticsEventAction } from '../../ngrx/actions';
import * as dateUtil from '../util/date';

@Component({
  selector: 'metrics-menu-bar',
  template: `
    <div class="menu-bar">
      <metrics-chart-type [selectedChartType]="chartType$ | async"
                          (chartTypeChange)="onChartTypeChange($event)"></metrics-chart-type>
      <metrics-interval-dropdown [routerState]="routerState$ | async"
                                 (intervalChange)="onIntervalChange($event)"></metrics-interval-dropdown>
      <div class="empty"></div>
      <metrics-standard-date-range-dropdown [interval]="interval$ | async" [standardRange]="standardRange$ | async"
                                            (standardRangeChange)="onStandardRangeChange($event)"
                                            (custom)="custom.toggleOpen()"></metrics-standard-date-range-dropdown>
      <metrics-custom-date-range-dropdown [routerState]="routerState$ | async" #custom
                                          (dateRangeChange)="onAdvancedChange($event)"></metrics-custom-date-range-dropdown>
    </div>
    <div class="summary">
      <metrics-date-range-summary [routerState]="routerState$ | async"></metrics-date-range-summary>
      <metrics-downloads-summary></metrics-downloads-summary>
    </div>
  `,
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
  @Output() routeFromFilter = new EventEmitter();
  routerState$: Observable<RouterModel>;
  chartType$: Observable<ChartType>;
  interval$: Observable<IntervalModel>;
  standardRange$: Observable<string>;

  constructor(public store: Store<any>) {
    this.routerState$ = this.store.select(selectRouter);
    this.chartType$ = this.store.select(selectChartTypeRoute);
    this.interval$ = this.store.select(selectIntervalRoute);
    this.standardRange$ = this.store.select(selectStandardRangeRoute);
  }

  onIntervalChange(interval: IntervalModel) {
    this.routerState$.take(1).subscribe((routerState: RouterModel) => {
      this.adjustAndRoute({...routerState, interval});
    });
  }

  onStandardRangeChange(standardRange: string) {
    const dateRange = dateUtil.getBeginEndDateFromStandardRange(standardRange);
    this.routerState$.subscribe((routerState: RouterModel) => {
      this.googleAnalyticsEvent('standard-date', dateRange, routerState.interval);
      this.onAdvancedChange({...routerState, standardRange, ...dateRange});
    });
  }

  onAdvancedChange(newRouterState: RouterModel) {
    this.routerState$.take(1).subscribe((routerState: RouterModel) => {
      if (newRouterState.beginDate.valueOf() !== routerState.beginDate.valueOf() ||
        newRouterState.endDate.valueOf() !== routerState.endDate.valueOf() ||
        newRouterState.interval !== routerState.interval) {
        this.adjustAndRoute({...routerState, ...newRouterState});
      }
    });
  }

  adjustAndRoute(routerState: RouterModel) {
    routerState.beginDate = dateUtil.roundDateToBeginOfInterval(routerState.beginDate, routerState.interval);
    routerState.endDate = dateUtil.roundDateToEndOfInterval(routerState.endDate, routerState.interval);
    routerState.standardRange = dateUtil.getStandardRangeForBeginEndDate(routerState.beginDate, routerState.endDate, routerState.interval);
    this.routeFromFilter.emit(routerState);
  }

  onChartTypeChange(chartType: ChartType) {
    this.routerState$.take(1).subscribe((routerState: RouterModel) => {
      console.log('onChartTypeChange', routerState);
      this.routeFromFilter.emit({...routerState, chartType});
    });
  }

  googleAnalyticsEvent(action: string, dateRange: {beginDate, endDate}, interval: IntervalModel) {
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'routerState-' + action, value}));
  }
}
