import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IntervalModel, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '../../ngrx';
import { selectPodcastMetricsFilteredAverage, selectPodcastMetricsFilteredTotal, selectIntervalRoute } from '../../ngrx/reducers';

@Component({
  selector: 'metrics-downloads-summary',
  template: `
    <div class="separator"></div>
    <metrics-downloads-summary-item label="downloads" [value]="total$ | async"></metrics-downloads-summary-item>
    <div class="separator"></div>
    <metrics-downloads-summary-item [label]="averageLabel$ | async" [value]="average$ | async"></metrics-downloads-summary-item>
  `,
  styleUrls: ['downloads-summary-container.component.css']
})

export class DownloadsSummaryContainerComponent {
  average$: Observable<number>;
  averageLabel$: Observable<string>;
  total$: Observable<number>;

  constructor(private store: Store<any>) {
    this.average$ = store.select(selectPodcastMetricsFilteredAverage);
    this.averageLabel$ = store.select(selectIntervalRoute).map((interval: IntervalModel) => {
      switch (interval) {
        case INTERVAL_HOURLY:
          return 'average / hour';
        case INTERVAL_DAILY:
          return 'average / day';
        case INTERVAL_WEEKLY:
          return 'average / week';
        case INTERVAL_MONTHLY:
          return 'average / month';
      }
    });
    this.total$ = store.select(selectPodcastMetricsFilteredTotal);
  }
}
