import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterParams, TotalsTableRow, PodcastTotals } from '../ngrx';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as ACTIONS from '../ngrx/actions';
import {
  select500ErrorReloadActions,
  selectGroupedPodcastDataLoaded, selectGroupedPodcastDataLoading,
  selectNestedPodcastTotalsLoaded, selectNestedPodcastTotalsLoading,
  selectNested500ErrorReloadActions,
  selectRoutedPodcastRanksChartMetrics,
  selectRoutedPodcastTotals,
  selectNestedPodcastTotals,
  selectRoutedPodcastTotalsTableMetrics,
  selectNestedPodcastTotalsTableMetrics,
  selectRouter,
  selectIsGroupGeoCountry,
  selectIsGroupGeoMetro
} from '../ngrx/reducers/selectors';

@Component ({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-geochart-map [data]="geochartData$ | async"
                            [nestedData]="nestedGeochartData$ | async"
                            [nestedDataLoading]="nestedTotalsLoading$ | async"
                            [nestedDataLoaded]="nestedTotalsLoaded$ | async"
                            [routerParams]="routerParams$ | async"></metrics-geochart-map>
      <metrics-totals-table *ngIf="isGroupGeoMetro$ | async"
                            numRowsWithToggle="0" [tableData]="tableData$ | async" [routerParams]="routerParams$ | async">
      </metrics-totals-table>
      <metrics-nested-totals-table *ngIf="isGroupGeoCountry$ | async"
                                   [routerParams]="routerParams$ | async"
                                   [tableData]="tableData$ | async"
                                   [nestedData]="nestedTableData$ | async"
                                   [nestedDataLoading]="nestedTotalsLoading$ | async"
                                   [nestedDataLoaded]="nestedTotalsLoaded$ | async"
                                   [nestedDataErrorActions]="nestedTotalsErrorActions$ | async"
                                   (discloseNestedData)="groupFilter($event)">
      </metrics-nested-totals-table>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `,
  styleUrls: ['./geo.component.css']
})

export class GeoComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  chartData$: Observable<CategoryChartModel[] | TimeseriesChartModel[]>;
  geochartData$: Observable<PodcastTotals>;
  nestedGeochartData$: Observable<PodcastTotals>;
  tableData$: Observable<TotalsTableRow[]>;
  nestedTableData$: Observable<TotalsTableRow[]>;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  nestedTotalsLoading$: Observable<boolean>;
  nestedTotalsLoaded$: Observable<boolean>;
  nestedTotalsErrorActions$: Observable<ACTIONS.AllActions[]>;
  errors$: Observable<ACTIONS.AllActions[]>;
  isGroupGeoCountry$: Observable<boolean>;
  isGroupGeoMetro$: Observable<boolean>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.chartData$ = this.store.pipe(select(selectRoutedPodcastRanksChartMetrics));
    this.geochartData$ = this.store.pipe(select(selectRoutedPodcastTotals));
    this.nestedGeochartData$ = this.store.pipe(select(selectNestedPodcastTotals));
    this.tableData$ = this.store.pipe(select(selectRoutedPodcastTotalsTableMetrics));
    this.nestedTableData$ = this.store.pipe(select(selectNestedPodcastTotalsTableMetrics));
    this.loaded$ = this.store.pipe(select(selectGroupedPodcastDataLoaded));
    this.loading$ = this.store.pipe(select(selectGroupedPodcastDataLoading));
    this.nestedTotalsLoading$ = this.store.pipe(select(selectNestedPodcastTotalsLoading));
    this.nestedTotalsLoaded$ = this.store.pipe(select(selectNestedPodcastTotalsLoaded));
    this.nestedTotalsErrorActions$ = this.store.pipe(select(selectNested500ErrorReloadActions));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
    this.isGroupGeoCountry$ = this.store.pipe(select(selectIsGroupGeoCountry));
    this.isGroupGeoMetro$ = this.store.pipe(select(selectIsGroupGeoMetro));
  }

  groupFilter(code: string) {
    this.store.dispatch(new ACTIONS.RouteGroupFilterAction({filter: code}));
  }
}
