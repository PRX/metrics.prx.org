import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterModel, CHARTTYPE_PODCAST } from '../ngrx';
import { RouteChartTypeAction } from '../ngrx/actions';
import { selectRouter, selectDownloadChartMetrics } from '../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <metrics-downloads-chart-presentation
      [chartData]="chartData$ | async"
      [routerState]="routerState$ | async"
      (placeholder)="routeToPodcastChart()">
    </metrics-downloads-chart-presentation>
  `
})
export class DownloadsChartContainerComponent implements OnInit {
  routerState$: Observable<RouterModel>;
  chartData$: Observable<TimeseriesChartModel[]>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerState$ = this.store.select(selectRouter);
    this.chartData$ = this.store.select(selectDownloadChartMetrics);
  }

  routeToPodcastChart(): void {
    this.store.dispatch(new RouteChartTypeAction({chartType: CHARTTYPE_PODCAST}));
  }
}
