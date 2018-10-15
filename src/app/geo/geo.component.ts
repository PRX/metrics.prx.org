import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterParams, TotalsTableRow, PodcastTotals,
  GroupType, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, ChartType, CHARTTYPE_GEOCHART } from '../ngrx';
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
  selectGroupRoute,
  selectChartTypeRoute
} from '../ngrx/reducers/selectors';

@Component ({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <div *ngIf="(chartTypeRoute$ | async) === CHARTTYPE_GEOCHART; else charted">
      <metrics-geochart-map [data]="geochartData$ | async"
                            [nestedData]="nestedGeochartData$ | async"
                            [nestedDataLoading]="nestedTotalsLoading$ | async"
                            [nestedDataLoaded]="nestedTotalsLoaded$ | async"
                            [routerParams]="routerParams$ | async"></metrics-geochart-map>
      </div>
      <ng-template #charted>
        <metrics-geo-chart [routerParams]="routerParams$ | async"
                           [chartData]="chartData$ | async"></metrics-geo-chart>
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
                                     [nestedDataErrorActions]="nestedTotalsErrorActions$ | async"
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
  chartTypeRoute$: Observable<ChartType>;
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
  GROUPTYPE_GEOCOUNTRY = GROUPTYPE_GEOCOUNTRY;
  GROUPTYPE_GEOMETRO = GROUPTYPE_GEOMETRO;
  CHARTTYPE_GEOCHART = CHARTTYPE_GEOCHART;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.groupRoute$ = this.store.pipe(select(selectGroupRoute));
    this.chartTypeRoute$ = this.store.pipe(select(selectChartTypeRoute));
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
  }

  groupFilter(code: string) {
    this.store.dispatch(new ACTIONS.RouteGroupFilterAction({filter: code}));
  }
}
