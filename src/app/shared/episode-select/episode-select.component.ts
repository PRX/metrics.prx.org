import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Episode } from '../../ngrx';
import { selectRoutedPodcastEpisodeSelectEpisodes, selectEpisodeSelectLoading,
  selectEpisodeSelectedEpisodeGuids, selectEpisodeSelectTotal,
  selectLatestEpisodeSelectPage, selectNumEpisodeSelectPages,
  selectEpisodeSelectSearchTerm, selectPodcastRoute } from '../../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-episode-select',
  template: `
    <metrics-episode-select-dropdown
      [episodes]="episodes$ | async"
      [searchTerm]="searchTerm$ | async"
      [episodesLoading]="episodesLoading$ | async"
      [selectedEpisodes]="selectedEpisodeGuids$ | async"
      [totalEpisodes]="totalEpisodes$| async"
      [podcastId]="podcastId$ | async"
      [lastPage]="lastPage$ | async"
      [maxPages]="maxPages$ | async">
    </metrics-episode-select-dropdown>
  `
})
export class EpisodeSelectComponent {
  episodes$: Observable<Episode[]>;
  searchTerm$: Observable<string>;
  episodesLoading$: Observable<boolean>;
  selectedEpisodeGuids$: Observable<string[]>;
  totalEpisodes$: Observable<number>;
  lastPage$: Observable<number>;
  maxPages$: Observable<number>;
  podcastId$: Observable<string>;

  constructor(private store: Store<any>) {
    this.episodes$ = this.store.pipe(select(selectRoutedPodcastEpisodeSelectEpisodes));
    this.searchTerm$ = this.store.pipe(select(selectEpisodeSelectSearchTerm));
    this.episodesLoading$ = this.store.pipe(select(selectEpisodeSelectLoading));
    this.selectedEpisodeGuids$ = this.store.pipe(select(selectEpisodeSelectedEpisodeGuids));
    this.totalEpisodes$ = this.store.pipe(select(selectEpisodeSelectTotal));
    this.lastPage$ = this.store.pipe(select(selectLatestEpisodeSelectPage));
    this.maxPages$ = this.store.pipe(select(selectNumEpisodeSelectPages));
    this.podcastId$ = this.store.pipe(select(selectPodcastRoute));
  }
}
