import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectPodcastListenersLoading, selectPodcastListenersLoaded, select500ErrorReloadActions } from '@app/ngrx/reducers/selectors';
import { AllActions } from '@app/ngrx/actions';

@Component({
  template: `
    <prx-spinner *ngIf="loading$ | async" overlay="true" loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-listeners-chart></metrics-listeners-chart>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `
})
export class ListenersComponent implements OnInit {
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<AllActions[]>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectPodcastListenersLoading));
    this.loaded$ = this.store.pipe(select(selectPodcastListenersLoaded));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
  }
}
