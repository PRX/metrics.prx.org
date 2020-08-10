import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterParams } from '@app/ngrx';
import { selectRouter, selectListenersChartMetrics } from '@app/ngrx/reducers/selectors';

@Component({
  selector: 'metrics-listeners-chart',
  template: `
    <metrics-listeners-chart-presentation [chartData]="chartData$ | async" [routerParams]="routerParams$ | async">
    </metrics-listeners-chart-presentation>
  `
})
export class ListenersChartContainerComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  chartData$: Observable<TimeseriesChartModel[]>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.chartData$ = this.store.pipe(select(selectListenersChartMetrics));
  }
}
