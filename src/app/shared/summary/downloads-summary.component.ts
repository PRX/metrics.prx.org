import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectDownloadsSummaryTotal } from '../../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-downloads-summary',
  template: `
    <div class="label">Downloads</div>
    <div class="value">{{ this.total$ | async | largeNumber }}</div>
  `,
  styleUrls: ['./downloads-summary.component.css']
})

export class DownloadsSummaryComponent implements OnInit {
  total$: Observable<number>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.total$ = this.store.pipe(select(selectDownloadsSummaryTotal));
  }
}
