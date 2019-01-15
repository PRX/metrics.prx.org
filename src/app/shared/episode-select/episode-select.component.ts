import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Episode } from '../../ngrx';
import { selectRoutedPodcastEpisodeSelectEpisodes, selectEpisodeSelectLoading,
  selectEpisodeSelectedEpisodeGuids, selectEpisodeSelectTotal,
  selectLatestEpisodeSelectPage, selectNumEpisodeSelectPages,
  selectEpisodeSelectSearchTerm, selectEpisodeSelectSearchTotal, selectPodcastRoute } from '../../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-episode-select',
  template: `
    <metrics-episode-select-dropdown
      [episodes]="episodes$ | async"
      [searchTerm]="searchTerm$ | async"
      [episodesLoading]="episodesLoading$ | async"
      [selectedEpisodes]="selectedEpisodeGuids$ | async"
      [totalEpisodes]="totalEpisodes$ | async"
      [searchTotal]="searchTotal$ | async"
      [podcastId]="podcastId$ | async"
      [lastPage]="lastPage$ | async"
      [maxPages]="maxPages$ | async">
    </metrics-episode-select-dropdown>
  `
})
export class EpisodeSelectComponent implements OnInit {
  episodes$: Observable<Episode[]>;
  searchTerm$: Observable<string>;
  episodesLoading$: Observable<boolean>;
  selectedEpisodeGuids$: Observable<string[]>;
  totalEpisodes$: Observable<number>;
  searchTotal$: Observable<number>;
  lastPage$: Observable<number>;
  maxPages$: Observable<number>;
  podcastId$: Observable<string>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.episodes$ = this.store.pipe(select(selectRoutedPodcastEpisodeSelectEpisodes));
    this.searchTerm$ = this.store.pipe(select(selectEpisodeSelectSearchTerm));
    this.episodesLoading$ = this.store.pipe(select(selectEpisodeSelectLoading));
    this.selectedEpisodeGuids$ = this.store.pipe(select(selectEpisodeSelectedEpisodeGuids));
    this.totalEpisodes$ = this.store.pipe(select(selectEpisodeSelectTotal));
    this.searchTotal$ = this.store.pipe(select(selectEpisodeSelectSearchTotal));
    this.lastPage$ = this.store.pipe(select(selectLatestEpisodeSelectPage));
    this.maxPages$ = this.store.pipe(select(selectNumEpisodeSelectPages));
    this.podcastId$ = this.store.pipe(select(selectPodcastRoute));
  }
}
