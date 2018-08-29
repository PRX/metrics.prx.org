import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterParams, TotalsTableRow } from '../ngrx';
import {CategoryChartModel, TimeseriesChartModel} from 'ngx-prx-styleguide';
import * as ACTIONS from '../ngrx/actions';
import {
  select500ErrorReloadActions,
  selectGroupedPodcastDataLoaded, selectGroupedPodcastDataLoading,
  selectRoutedPodcastRanksChartMetrics,
  selectRoutedPodcastTotalsTableMetrics,
  selectRouter
} from '../ngrx/reducers/selectors';

@Component ({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <section class="content soon">coming soon</section>
      <metrics-totals-table numRowsWithToggle="0" [tableData]="tableData$ | async" [routerParams]="routerParams$ | async">
      </metrics-totals-table>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `,
  styleUrls: ['../shared/nav/soon.css']
})

export class GeoComponent implements OnInit {
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
}
