import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Episode } from '../../ngrx';
import { selectRoutedPodcastSearchEpisodes, selectEpisodeSearchLoading,
  selectLastEpisodeSearchPage, selectNumEpisodeSearchPages,
  selectPodcastRoute } from '../../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-episode-search',
  template: `
    <metrics-episode-search-dropdown
      [episodes]="episodes$ | async"
      [episodesLoading]="episodesLoading$ | async"
      [podcastId]="podcastId$ | async"
      [lastPage]="lastPage$ | async"
      [maxPages]="maxPages$ | async">
    </metrics-episode-search-dropdown>
  `
})
export class EpisodeSearchComponent {
  episodes$: Observable<Episode[]>;
  episodesLoading$: Observable<boolean>;
  lastPage$: Observable<number>;
  maxPages$: Observable<number>;
  podcastId$: Observable<string>;

  constructor(private store: Store<any>) {
    this.episodes$ = this.store.pipe(select(selectRoutedPodcastSearchEpisodes));
    this.episodesLoading$ = this.store.pipe(select(selectEpisodeSearchLoading));
    this.lastPage$ = this.store.pipe(select(selectLastEpisodeSearchPage));
    this.maxPages$ = this.store.pipe(select(selectNumEpisodeSearchPages));
    this.podcastId$ = this.store.pipe(select(selectPodcastRoute));
  }
}
