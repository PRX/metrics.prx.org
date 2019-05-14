import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CategoryChartModel, IndexedChartModel } from 'ngx-prx-styleguide';
import { RouterParams } from '@app/ngrx';
import { selectRouter, selectDropdayChartMetrics } from '@app/ngrx/reducers/selectors';

@Component({
  selector: 'metrics-dropday-chart',
  template: `
    <metrics-dropday-chart-presentation
      [chartData]="chartData$ | async"
      [routerParams]="routerParams$ | async">
    </metrics-dropday-chart-presentation>
  `
})
export class DropdayChartContainerComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  chartData$: Observable<IndexedChartModel[] | CategoryChartModel[]>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.chartData$ = this.store.pipe(select(selectDropdayChartMetrics));
  }
}
