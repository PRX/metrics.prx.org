import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectFilter, selectEpisodes } from '../../ngrx/reducers';
import { EpisodeModel, FilterModel } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';
import { filterAllPodcastEpisodes } from '../../shared/util/metrics.util';

@Component({
  selector: 'metrics-episodes',
  template: `
    <span>Episodes:</span>
    <span>
      <prx-select [options]="allEpisodeOptions" [selected]="selected" searchable="true" (onSelect)="onEpisodesChange($event)"></prx-select>
    </span>
  `
})
export class EpisodesComponent implements OnInit, OnDestroy {
  selected: EpisodeModel[];
  allEpisodeOptions = [];
  filterSub: Subscription;
  allEpisodesSub: Subscription;
  filter: FilterModel;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter) {
        if (this.isPodcastChanged(newFilter)) {
          this.allEpisodeOptions = [];
        }
        this.filter = newFilter;
        this.selected = newFilter.episodes;
      }
    });
    this.allEpisodesSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      const allPodcastEpisodes = filterAllPodcastEpisodes(this.filter, allEpisodes);
      if (allPodcastEpisodes) {
        this.allEpisodeOptions = allPodcastEpisodes.map((episode: EpisodeModel) => {
          return [episode.title, episode];
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.filterSub) { this.filterSub.unsubscribe(); }
    if (this.allEpisodesSub) { this.allEpisodesSub.unsubscribe(); }
  }

  isPodcastChanged(state: FilterModel): boolean {
    return state.podcast && (!this.filter.podcast ||  this.filter.podcast.seriesId !== state.podcast.seriesId);
  }

  onEpisodesChange(episodes: EpisodeModel[]) {
    this.store.dispatch(new CastleFilterAction({filter: {episodes}}));
  }
}
