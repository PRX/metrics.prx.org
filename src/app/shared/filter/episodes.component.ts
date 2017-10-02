import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/subscription';
import { selectEpisodeFilter, selectEpisodes } from '../../ngrx/reducers';
import { EpisodeModel } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

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
  allEpisodeOptions: any[][];
  episodeFilterSub: Subscription;
  allEpisodesSub: Subscription;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.episodeFilterSub = this.store.select(selectEpisodeFilter).subscribe((filteredEpisodes: EpisodeModel[]) => {
      if (filteredEpisodes) {
        this.selected = filteredEpisodes;
      }
    });
    this.allEpisodesSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      if (allEpisodes) {
        this.allEpisodeOptions = allEpisodes.map((episode: EpisodeModel) => {
          return [episode.title, episode];
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.episodeFilterSub) { this.episodeFilterSub.unsubscribe(); }
    if (this.allEpisodesSub) { this.allEpisodesSub.unsubscribe(); }
  }

  onEpisodesChange(episodes: EpisodeModel[]) {
    this.store.dispatch(new CastleFilterAction({filter: {episodes}}));
  }
}
