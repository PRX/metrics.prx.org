import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectEpisodes } from '../../ngrx/reducers';
import { EpisodeModel, FilterModel, PodcastModel } from '../../ngrx/model';
import { filterAllPodcastEpisodes } from '../../shared/util/metrics.util';

@Component({
  selector: 'metrics-episodes',
  template: `
    <div>Episodes:</div>
    <prx-select [options]="allEpisodeOptions" [selected]="selected" searchable="true" (onSelect)="onEpisodesChange($event)"></prx-select>
  `
})
export class EpisodesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filter: FilterModel;
  @Output() episodesChange = new EventEmitter<EpisodeModel[]>();
  selectedPodcast: PodcastModel;
  selected: EpisodeModel[];
  allEpisodeOptions = [];
  allEpisodesSub: Subscription;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.allEpisodesSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      const allPodcastEpisodes = filterAllPodcastEpisodes(this.filter, allEpisodes);
      if (allPodcastEpisodes) {
        this.allEpisodeOptions = allPodcastEpisodes.map((episode: EpisodeModel) => {
          return [episode.title, episode];
        });
      }
    });
  }

  ngOnChanges() {
    if (this.filter) {
      if (this.isPodcastChanged()) {
        this.allEpisodeOptions = [];
      }
      this.selected = this.filter.episodes;
      this.selectedPodcast = this.filter.podcast;
    }
  }

  ngOnDestroy() {
    if (this.allEpisodesSub) { this.allEpisodesSub.unsubscribe(); }
  }

  isPodcastChanged(): boolean {
    return this.selectedPodcast && this.filter.podcast && this.filter.podcast.seriesId !== this.selectedPodcast.seriesId;
  }

  onEpisodesChange(episodes: EpisodeModel[]) {
    this.episodesChange.emit(episodes);
  }
}
