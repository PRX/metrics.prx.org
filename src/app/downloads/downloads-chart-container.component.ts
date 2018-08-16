import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterParams, CHARTTYPE_PODCAST } from '../ngrx';
import { RouteChartTypeAction } from '../ngrx/actions';
import { selectRouter, selectDownloadChartMetrics } from '../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-downloads-chart',
  template: `
    <metrics-downloads-chart-presentation
      [chartData]="chartData$ | async"
      [routerParams]="routerParams$ | async"
      (placeholder)="routeToPodcastChart()">
    </metrics-downloads-chart-presentation>
  `
})
export class DownloadsChartContainerComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  chartData$: Observable<TimeseriesChartModel[]>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.chartData$ = this.store.pipe(select(selectDownloadChartMetrics));
  }

  routeToPodcastChart(): void {
    this.store.dispatch(new RouteChartTypeAction({chartType: CHARTTYPE_PODCAST}));
  }
}
