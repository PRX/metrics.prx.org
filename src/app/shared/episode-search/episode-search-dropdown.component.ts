import { Component, ElementRef, Input, Renderer2, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Episode, EPISODE_SEARCH_PAGE_SIZE } from '../../ngrx';
import { CastleEpisodeSearchPageLoadAction, EpisodeSearchSelectEpisodesAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-episode-search-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()">
          <span class="button-text">{{ buttonText }}</span>
          <span class="down-arrow"></span>
        </button>
      </div>
      <div class="dropdown-content rollout" #dropdownContent>
        <metrics-episode-search-input [searchTerm]="searchTerm" (search)="loadEpisodesOnSearch($event)"></metrics-episode-search-input>
        <metrics-episode-search-list
          [episodes]="episodes"
          [episodesLoading]="episodesLoading"
          [selectedEpisodes]="selectedEpisodes"
          (selectEpisode)="onToggleSelectEpisode($event)">
        </metrics-episode-search-list>
      </div>
    </div>
  `,
  styleUrls: ['../dropdown/dropdown.css', '../dropdown/nav-dropdown.css']
})
export class EpisodeSearchDropdownComponent implements OnInit {
  @Input() episodes: Episode[];
  @Input() searchTerm: string;
  @Input() episodesLoading: boolean;
  @Input() selectedEpisodes: string[];
  @Input() totalEpisodes: number;
  @Input() lastPage: number;
  @Input() maxPages: number;
  @Input() podcastId: string;
  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  open = false;

  constructor(private renderer: Renderer2,
              private store: Store<any>) {}

  ngOnInit() {
    this.loadEpisodesOnScroll();
  }

  loadEpisodesOnScroll() {
    const element = this.dropdownContent.nativeElement;
    this.renderer.listen(element, 'scroll', () => {
      // when scrollTop + clientHeight approaches scrollHeight, load the next page
      const { clientHeight, scrollHeight, scrollTop } = element;
      if (!this.episodesLoading &&
          scrollTop + clientHeight >= (scrollHeight - 100) &&
          this.lastPage + 1 <= this.maxPages) {
        this.loadEpisodes(this.lastPage + 1, this.searchTerm);
      }
    });
  }

  loadEpisodesOnSearch(search: string) {
    this.loadEpisodes(1, search);
  }

  loadEpisodes(page: number, search: string) {
    this.store.dispatch(new CastleEpisodeSearchPageLoadAction({
      podcastId: this.podcastId,
      page,
      per: EPISODE_SEARCH_PAGE_SIZE,
      search
    }));
  }

  onToggleSelectEpisode(episode: Episode) {
    let episodeGuids;
    if (!this.selectedEpisodes) {
      episodeGuids = [episode.guid];
    } else if (this.selectedEpisodes.indexOf(episode.guid) === -1) {
      episodeGuids = this.selectedEpisodes.concat([episode.guid]);
    } else {
      episodeGuids = this.selectedEpisodes.filter(e => e !== episode.guid);
    }
    this.store.dispatch(new EpisodeSearchSelectEpisodesAction({episodeGuids}));
  }

  toggleOpen() {
    this.open = !this.open;
  }

  get buttonText(): string {
    if (this.totalEpisodes === null) {
      return 'episodes';
    } else if (this.totalEpisodes === 0) {
      return 'No results';
    } else if (this.selectedEpisodes && this.selectedEpisodes.length) {
      return `${this.selectedEpisodes.length} of ${this.totalEpisodes} episodes`;
    } else {
      return `${this.totalEpisodes} episodes`;
    }
  }
}
