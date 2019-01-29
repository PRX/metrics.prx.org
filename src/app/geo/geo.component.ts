import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterParams, TotalsTableRow, Rank,
  GroupType, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, ChartType, CHARTTYPE_GEOCHART } from '../ngrx';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as ACTIONS from '../ngrx/actions';
import {
  select500ErrorReloadActions,
  selectGroupedDataLoaded, selectGroupedDataLoading,
  selectNestedTotalsLoaded, selectNestedTotalsLoading,
  selectNestedRanksLoaded, selectNestedRanksLoading,
  selectNested500ErrorReloadActions,
  selectChartMetrics,
  selectNestedChartMetrics,
  selectTotalsRanks,
  selectNestedTotalsRanks,
  selectTableMetrics,
  selectNestedTableMetrics,
  selectRouter,
  selectGroupRoute,
  selectFilterRoute,
  selectChartTypeRoute
} from '../ngrx/reducers/selectors';

@Component ({
  template: `
    <metrics-episode-select-dropdown></metrics-episode-select-dropdown>
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>

      <div *ngIf="(chartTypeRoute$ | async) === CHARTTYPE_GEOCHART; else charted" class="chart-container">
        <metrics-geochart-map [data]="geochartData$ | async"
                              [nestedData]="nestedGeochartData$ | async"
                              [routerParams]="routerParams$ | async"></metrics-geochart-map>
        <prx-spinner overlay="true" *ngIf="(filterRoute$ | async) && (nestedTotalsLoading$ | async)"></prx-spinner>
      </div>
      <ng-template #charted>
        <div class="chart-container">
          <metrics-geo-chart *ngIf="!(filterRoute$ | async) || (nestedRanksLoaded$ | async)"
                             [routerParams]="routerParams$ | async"
                             [chartData]="chartData$ | async"
                             [nestedData]="nestedChartData$ | async"></metrics-geo-chart>
          <prx-spinner overlay="true" *ngIf="(filterRoute$ | async) && (nestedRanksLoading$ | async)"></prx-spinner>
        </div>
      </ng-template>

      <div *ngIf="(groupRoute$ | async) === GROUPTYPE_GEOMETRO; else nested">
        <metrics-totals-table numRowsWithToggle="0" [tableData]="tableData$ | async" [routerParams]="routerParams$ | async">
        </metrics-totals-table>
      </div>
      <ng-template #nested>
        <metrics-nested-totals-table *ngIf="(routerParams$ | async)?.group === GROUPTYPE_GEOCOUNTRY"
                                     [routerParams]="routerParams$ | async"
                                     [tableData]="tableData$ | async"
                                     [nestedData]="nestedTableData$ | async"
                                     [nestedDataLoading]="nestedTotalsLoading$ | async"
                                     [nestedDataLoaded]="nestedTotalsLoaded$ | async"
                                     [nestedDataErrorActions]="nestedDataErrorActions$ | async"
                                     (discloseNestedData)="groupFilter($event)">
        </metrics-nested-totals-table>
      </ng-template>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `,
  styleUrls: ['./geo.component.css']
})

export class GeoComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  groupRoute$: Observable<GroupType>;
  filterRoute$: Observable<string>;
  chartTypeRoute$: Observable<ChartType>;
  chartData$: Observable<CategoryChartModel[] | TimeseriesChartModel[]>;
  nestedChartData$: Observable<TimeseriesChartModel[]>;
  nestedRanksLoading$: Observable<boolean>;
  nestedRanksLoaded$: Observable<boolean>;
  geochartData$: Observable<Rank[]>;
  nestedGeochartData$: Observable<Rank[]>;
  tableData$: Observable<TotalsTableRow[]>;
  nestedTableData$: Observable<TotalsTableRow[]>;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  nestedTotalsLoading$: Observable<boolean>;
  nestedTotalsLoaded$: Observable<boolean>;
  nestedDataErrorActions$: Observable<ACTIONS.AllActions[]>;
  errors$: Observable<ACTIONS.AllActions[]>;
  GROUPTYPE_GEOCOUNTRY = GROUPTYPE_GEOCOUNTRY;
  GROUPTYPE_GEOMETRO = GROUPTYPE_GEOMETRO;
  CHARTTYPE_GEOCHART = CHARTTYPE_GEOCHART;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.groupRoute$ = this.store.pipe(select(selectGroupRoute));
    this.filterRoute$ = this.store.pipe(select(selectFilterRoute));
    this.chartTypeRoute$ = this.store.pipe(select(selectChartTypeRoute));
    this.chartData$ = this.store.pipe(select(selectChartMetrics));
    this.nestedChartData$ = this.store.pipe(select(selectNestedChartMetrics));
    this.geochartData$ = this.store.pipe(select(selectTotalsRanks));
    this.nestedGeochartData$ = this.store.pipe(select(selectNestedTotalsRanks));
    this.tableData$ = this.store.pipe(select(selectTableMetrics));
    this.nestedTableData$ = this.store.pipe(select(selectNestedTableMetrics));
    this.loaded$ = this.store.pipe(select(selectGroupedDataLoaded));
    this.loading$ = this.store.pipe(select(selectGroupedDataLoading));
    this.nestedTotalsLoading$ = this.store.pipe(select(selectNestedTotalsLoading));
    this.nestedTotalsLoaded$ = this.store.pipe(select(selectNestedTotalsLoaded));
    this.nestedRanksLoading$ = this.store.pipe(select(selectNestedRanksLoading));
    this.nestedRanksLoaded$ = this.store.pipe(select(selectNestedRanksLoaded));
    this.nestedDataErrorActions$ = this.store.pipe(select(selectNested500ErrorReloadActions));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
  }

  groupFilter(code: string) {
    this.store.dispatch(new ACTIONS.RouteGroupFilterAction({filter: code}));
  }
}
