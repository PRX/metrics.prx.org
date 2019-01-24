import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Episode, RouterParams } from '../../ngrx';
import { selectRoutedPodcastEpisodesSelectList, selectEpisodeSelectLoading,
  selectSelectedEpisodeGuids, selectEpisodeSelectTotal,
  selectLatestEpisodeSelectPage, selectNumEpisodeSelectPages,
  selectEpisodeSelectSearchTerm, selectEpisodeSelectSearchTotal, selectRouter } from '../../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-episode-select',
  template: `
    <metrics-episode-select-dropdown
      [routerParams]="routerParams$ | async"
      [episodes]="episodes$ | async"
      [searchTerm]="searchTerm$ | async"
      [episodesLoading]="episodesLoading$ | async"
      [selectedEpisodes]="selectedEpisodeGuids$ | async"
      [totalEpisodes]="totalEpisodes$ | async"
      [searchTotal]="searchTotal$ | async"
      [lastPage]="lastPage$ | async"
      [maxPages]="maxPages$ | async">
    </metrics-episode-select-dropdown>
  `
})
export class EpisodeSelectComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  episodes$: Observable<Episode[]>;
  searchTerm$: Observable<string>;
  episodesLoading$: Observable<boolean>;
  selectedEpisodeGuids$: Observable<string[]>;
  totalEpisodes$: Observable<number>;
  searchTotal$: Observable<number>;
  lastPage$: Observable<number>;
  maxPages$: Observable<number>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.episodes$ = this.store.pipe(select(selectRoutedPodcastEpisodesSelectList));
    this.searchTerm$ = this.store.pipe(select(selectEpisodeSelectSearchTerm));
    this.episodesLoading$ = this.store.pipe(select(selectEpisodeSelectLoading));
    this.selectedEpisodeGuids$ = this.store.pipe(select(selectSelectedEpisodeGuids));
    this.totalEpisodes$ = this.store.pipe(select(selectEpisodeSelectTotal));
    this.searchTotal$ = this.store.pipe(select(selectEpisodeSelectSearchTotal));
    this.lastPage$ = this.store.pipe(select(selectLatestEpisodeSelectPage));
    this.maxPages$ = this.store.pipe(select(selectNumEpisodeSelectPages));
  }
}
