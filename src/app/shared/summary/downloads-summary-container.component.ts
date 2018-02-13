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
  `,
  styleUrls: ['downloads-summary-container.component.css']
})

export class DownloadsSummaryContainerComponent {
  average$: Observable<number>;
  averageLabel$: Observable<string>;
  total$: Observable<number>;

  constructor(private store: Store<any>) {
    this.total$ = store.select(selectPodcastMetricsFilteredTotal);
  }
}
