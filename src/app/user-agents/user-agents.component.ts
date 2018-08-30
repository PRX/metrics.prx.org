import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { selectRoutedPodcastRanksChartMetrics, selectRoutedPodcastTotalsTableMetrics, selectRouter,
  selectGroupedPodcastDataLoaded, selectGroupedPodcastDataLoading, select500ErrorReloadActions } from '../ngrx/reducers/selectors';
import { RouterParams, TotalsTableRow } from '../ngrx';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as ACTIONS from '../ngrx/actions';

@Component ({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-user-agents-chart [chartData]="chartData$ | async" [routerParams]="routerParams$ | async">
      </metrics-user-agents-chart>
      <metrics-totals-table [chartData]="chartData$ | async" [tableData]="tableData$ | async" [routerParams]="routerParams$ | async"
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
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<ACTIONS.AllActions[]>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.chartData$ = this.store.pipe(select(selectRoutedPodcastRanksChartMetrics));
    this.tableData$ = this.store.pipe(select(selectRoutedPodcastTotalsTableMetrics));
    this.loaded$ = this.store.pipe(select(selectGroupedPodcastDataLoaded));
    this.loading$ = this.store.pipe(select(selectGroupedPodcastDataLoading));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
  }

  toggleGroupCharted(params: {podcastId: string, groupName: string, charted: boolean}) {
    this.store.dispatch(new ACTIONS.ChartTogglePodcastGroupAction({...params}));
  }
}
