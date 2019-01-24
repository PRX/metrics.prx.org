import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { selectChartMetrics, selectTableMetrics, selectRouter, selectRoutedGroupCharted,
  selectGroupedDataLoaded, selectGroupedDataLoading, select500ErrorReloadActions } from '../ngrx/reducers/selectors';
import { RouterParams, TotalsTableRow, GroupCharted } from '../ngrx';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as ACTIONS from '../ngrx/actions';

@Component ({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-user-agents-chart
        [chartData]="chartData$ | async"
        [routerParams]="routerParams$ | async"
        [groupsCharted]="groupsCharted$ | async">
      </metrics-user-agents-chart>
      <metrics-totals-table
        [chartData]="chartData$ | async"
        [tableData]="tableData$ | async"
        [routerParams]="routerParams$ | async"
        (toggleEntry)="toggleGroupCharted($event)">
      </metrics-totals-table>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `,
})

export class UserAgentsComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  chartData$: Observable<CategoryChartModel[] | TimeseriesChartModel[]>;
  tableData$: Observable<TotalsTableRow[]>;
  groupsCharted$: Observable<GroupCharted[]>;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<ACTIONS.AllActions[]>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.chartData$ = this.store.pipe(select(selectChartMetrics));
    this.tableData$ = this.store.pipe(select(selectTableMetrics));
    this.groupsCharted$ = this.store.pipe(select(selectRoutedGroupCharted));
    this.loaded$ = this.store.pipe(select(selectGroupedDataLoaded));
    this.loading$ = this.store.pipe(select(selectGroupedDataLoading));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
  }

  toggleGroupCharted(params: {group: string, groupName: string, charted: boolean}) {
    this.store.dispatch(new ACTIONS.ChartToggleGroupAction({...params}));
  }
}
