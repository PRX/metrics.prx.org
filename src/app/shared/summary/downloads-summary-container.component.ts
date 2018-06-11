import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectPodcastMetricsFilteredTotal } from '../../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-downloads-summary',
  template: `
    <div class="separator"></div>
    <metrics-downloads-summary-item label="downloads" [value]="total$ | async"></metrics-downloads-summary-item>
  `,
  styleUrls: ['downloads-summary-container.component.css']
})

export class DownloadsSummaryContainerComponent {
  total$: Observable<number>;

  constructor(private store: Store<any>) {
    this.total$ = store.pipe(select(selectPodcastMetricsFilteredTotal));
  }
}
