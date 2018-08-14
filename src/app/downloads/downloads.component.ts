import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectLoading, selectLoaded, select500ErrorReloadActions } from '../ngrx/reducers/selectors';
import { AllActions } from '../ngrx/actions';

@Component({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-downloads-chart></metrics-downloads-chart>
      <metrics-downloads-table></metrics-downloads-table>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `,
  styleUrls: ['downloads.component.css']
})
export class DownloadsComponent implements OnInit {
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<AllActions[]>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectLoading));
    this.loaded$ = this.store.pipe(select(selectLoaded));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
  }
}
