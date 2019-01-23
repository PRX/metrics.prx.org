import { Component, ElementRef, Input, Renderer2, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Episode, EPISODE_SELECT_PAGE_SIZE, RouterParams, GROUPTYPE_GEOSUBDIV } from '../../ngrx';
import * as ACTIONS from '../../ngrx/actions';

@Component({
  selector: 'metrics-episode-select-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button" *ngIf="totalEpisodes !== null">
        <button (click)="toggleOpen()">
          <span class="button-text">
            {{ totalEpisodes | i18nPlural: {'=0': 'No episodes', '=1' : '1 episode', 'other' : '# episodes'} }}
          </span>
          <span class="down-arrow"></span>
        </button>
      </div>
      <div class="dropdown-content rollout" #dropdownContent>
        <metrics-episode-search
          [searchTerm]="searchTerm"
          [searchTotal]="searchTotal"
          (search)="loadEpisodesOnSearch($event)">
        </metrics-episode-search>
        <metrics-episode-select-list
          [episodes]="episodes"
          [episodesLoading]="episodesLoading"
          [selectedEpisodes]="selectedEpisodes"
          [totalEpisodes]="totalEpisodes"
          (selectEpisode)="onToggleSelectEpisode($event)">
        </metrics-episode-select-list>
      </div>
    </div>
  `,
  styleUrls: ['../dropdown/dropdown.css', '../dropdown/nav-dropdown.css']
})
export class EpisodeSelectDropdownComponent implements OnInit {
  @Input() routerParams: RouterParams;
  @Input() episodes: Episode[];
  @Input() searchTerm: string;
  @Input() episodesLoading: boolean;
  @Input() selectedEpisodes: string[];
  @Input() totalEpisodes: number;
  @Input() searchTotal: number;
  @Input() lastPage: number;
  @Input() maxPages: number;
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
        this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-page-load', value: this.lastPage + 1}));
      }
    });
  }

  loadEpisodesOnSearch(search: string) {
    this.loadEpisodes(1, search);
    this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-search'}));
  }

  loadEpisodes(page: number, search: string) {
    this.store.dispatch(new ACTIONS.CastleEpisodeSelectPageLoadAction({
      podcastId: this.routerParams.podcastId,
      page,
      per: EPISODE_SELECT_PAGE_SIZE,
      search
    }));
  }

  onToggleSelectEpisode(episode: Episode) {
    let episodeGuids: string[];
    const { podcastId, group, filter, interval, beginDate, endDate } = this.routerParams;
    if (!episode) {
      episodeGuids = [];

      this.store.dispatch(new ACTIONS.CastlePodcastRanksLoadAction({
        id: podcastId,
        group,
        filter,
        interval,
        beginDate,
        endDate
      }));
      this.store.dispatch(new ACTIONS.CastlePodcastTotalsLoadAction({
        id: podcastId,
        group,
        filter,
        beginDate,
        endDate
      }));
    } else if (!this.selectedEpisodes || this.selectedEpisodes.indexOf(episode.guid) === -1) {
      episodeGuids = this.selectedEpisodes ? this.selectedEpisodes.concat([episode.guid]) : [episode.guid];

      this.store.dispatch(new ACTIONS.CastleEpisodeRanksLoadAction({
        guid: episode.guid,
        group,
        interval,
        beginDate,
        endDate
      }));
      this.store.dispatch(new ACTIONS.CastleEpisodeTotalsLoadAction({
        guid: episode.guid,
        group,
        beginDate,
        endDate
      }));
      if (filter) {
        this.store.dispatch(new ACTIONS.CastleEpisodeRanksLoadAction({
          guid: episode.guid,
          group: GROUPTYPE_GEOSUBDIV,
          filter,
          interval,
          beginDate,
          endDate
        }));
        this.store.dispatch(new ACTIONS.CastleEpisodeTotalsLoadAction({
          guid: episode.guid,
          group: GROUPTYPE_GEOSUBDIV,
          filter,
          beginDate,
          endDate
        }));
      }
    } else {
      episodeGuids = this.selectedEpisodes.filter(e => e !== episode.guid);
    }
    this.store.dispatch(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids}));
    if (episodeGuids.length) {
      this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select', value: episodeGuids.length}));
    }
  }

  toggleOpen() {
    this.open = !this.open;
  }

  get buttonText(): string {
    return this.totalEpisodes ? `${this.totalEpisodes} episodes` : 'episodes';
  }
}
