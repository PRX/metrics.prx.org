import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectEpisodeDropdayLoading, selectEpisodeDropdayLoaded, select500ErrorReloadActions } from '@app/ngrx/reducers/selectors';
import { AllActions } from '@app/ngrx/actions';

@Component({
  template: `
    <metrics-episode-select-dropdown></metrics-episode-select-dropdown>
    <prx-spinner *ngIf="loading$ | async" overlay="true"
                 loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-dropday-chart></metrics-dropday-chart>
      <metrics-dropday-table></metrics-dropday-table>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `
})
export class DropdayComponent implements OnInit {
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<AllActions[]>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectEpisodeDropdayLoading));
    this.loaded$ = this.store.pipe(select(selectEpisodeDropdayLoaded));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
  }
}