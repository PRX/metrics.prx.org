import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectEpisodes } from '../../ngrx/reducers';
import { EpisodeModel, FilterModel, PodcastModel } from '../../ngrx/model';
import { filterAllPodcastEpisodes } from '../../shared/util/metrics.util';
import { isPodcastChanged } from '../../shared/util/filter.util';

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
  selectedPodcastSeriesId: number;
  selected: EpisodeModel[];
  allEpisodes: EpisodeModel[];
  allEpisodeOptions = [];
  allEpisodesSub: Subscription;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.allEpisodesSub = this.store.select(selectEpisodes).subscribe((allEpisodes: EpisodeModel[]) => {
      this.allEpisodes = allEpisodes;
      this.setOptions();
    });
  }

  ngOnChanges() {
    if (this.filter) {
      if (isPodcastChanged(this.filter, {podcastSeriesId: this.selectedPodcastSeriesId})) {
        this.allEpisodeOptions = [];
      }
      this.selectedPodcastSeriesId = this.filter.podcastSeriesId;
      this.setOptions();
    }
  }

  ngOnDestroy() {
    if (this.allEpisodesSub) { this.allEpisodesSub.unsubscribe(); }
  }

  setOptions() {
    let allPodcastEpisodes;
    if (this.allEpisodes && this.filter) {
      allPodcastEpisodes = filterAllPodcastEpisodes(this.filter, this.allEpisodes);
    }
    if (allPodcastEpisodes) {
      this.allEpisodeOptions = allPodcastEpisodes.map((episode: EpisodeModel) => {
        return [episode.title, episode];
      });
      this.setSelectedOptions();
    } else {
      this.allEpisodeOptions = [];
    }
  }

  setSelectedOptions() {
    if (this.filter.episodeIds) {
      this.selected = this.allEpisodeOptions.map(o => o[1]).filter(e => this.filter.episodeIds.indexOf(e.id) !== -1);
    } else {
      this.selected = null;
    }
  }

  onEpisodesChange(episodes: EpisodeModel[]) {
    this.episodesChange.emit(episodes);
  }
}
