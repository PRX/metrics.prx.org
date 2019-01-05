import { Component, ElementRef, Input, Renderer2, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Episode, EPISODE_SEARCH_PAGE_SIZE } from '../../ngrx';
import { CastleEpisodeSearchPageLoadAction, EpisodeSearchSelectEpisodesAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-episode-search-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button" *ngIf="totalEpisodes">
        <button (click)="toggleOpen()">
          <span class="button-text">{{ selectedEpisode?.title || "All " + totalEpisodes + " episodes" }}</span>
          <span class="down-arrow"></span>
        </button>
      </div>
      <div class="dropdown-content rollout" #dropdownContent>
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
        this.store.dispatch(new CastleEpisodeSearchPageLoadAction({
          podcastId: this.podcastId,
          page: this.lastPage + 1,
          per: EPISODE_SEARCH_PAGE_SIZE
        }));
      }
    });
  }

  onToggleSelectEpisode(episode) {
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
}
