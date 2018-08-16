import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectLoading, selectLoaded, selectErrors } from '../ngrx/reducers/selectors';

@Component({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-downloads-chart></metrics-downloads-chart>
      <metrics-downloads-table></metrics-downloads-table>
      <p class="error" *ngFor="let error of errors$ | async">{{error}}</p>
    </section>
  `,
  styleUrls: ['downloads.component.css']
})
export class DownloadsComponent implements OnInit {
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<string[]>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectLoading));
    this.loaded$ = this.store.pipe(select(selectLoaded));
    this.errors$ = this.store.pipe(select(selectErrors));
  }
}
