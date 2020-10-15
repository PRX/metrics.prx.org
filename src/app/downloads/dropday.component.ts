import { Component, OnInit } from '@angular/core';
import { Store, select, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Episode } from '@app/ngrx';
import {
  selectEpisodeDropdayLoading,
  selectEpisodeDropdayLoaded,
  selectDropdaySelectedEpisodeGuids,
  selectRoutedPodcastEpisodesSelectList,
  selectEpisodePagesLoading,
  select500ErrorReloadActions
} from '@app/ngrx/reducers/selectors';

@Component({
  template: `
    <metrics-episode-select-dropdown></metrics-episode-select-dropdown>
    <prx-spinner *ngIf="loading$ | async" overlay="true" loadingMessage="Please wait..."></prx-spinner>
    <section *ngIf="loaded$ | async">
      <metrics-menu-bar></metrics-menu-bar>
      <metrics-dropday-chart></metrics-dropday-chart>
      <metrics-dropday-table></metrics-dropday-table>
      <metrics-placeholder
        *ngIf="!(selectedEpisodes$ | async) && (episodeSelectList$ | async)?.length && !(episodePagesLoading$ | async)?.length"
      >
        You have no episodes selected.
      </metrics-placeholder>
    </section>
    <metrics-error-retry [retryActions]="errors$ | async"></metrics-error-retry>
  `
})
export class DropdayComponent implements OnInit {
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  errors$: Observable<Action[]>;
  selectedEpisodes$: Observable<string[]>;
  episodeSelectList$: Observable<Episode[]>;
  episodePagesLoading$: Observable<number[]>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectEpisodeDropdayLoading));
    this.loaded$ = this.store.pipe(select(selectEpisodeDropdayLoaded));
    this.errors$ = this.store.pipe(select(select500ErrorReloadActions));
    this.selectedEpisodes$ = this.store.pipe(select(selectDropdaySelectedEpisodeGuids));
    this.episodeSelectList$ = this.store.pipe(select(selectRoutedPodcastEpisodesSelectList));
    this.episodePagesLoading$ = this.store.pipe(select(selectEpisodePagesLoading));
  }
}
