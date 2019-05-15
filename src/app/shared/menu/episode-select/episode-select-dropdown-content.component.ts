import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Episode, EPISODE_SELECT_PAGE_SIZE, RouterParams, GROUPTYPE_GEOSUBDIV, METRICSTYPE_DROPDAY } from '@app/ngrx';
import * as ACTIONS from '@app/ngrx/actions';

@Component({
  selector: 'metrics-episode-select-dropdown-content',
  template: `
  <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen.emit(false)"></div>
      <div class="dropdown-content rollout">
        <div class="header">
          <img src="/assets/images/ic_search.svg" aria-hidden>
          <metrics-episode-search
            [searchTerm]="searchTerm"
            (search)="loadEpisodesOnSearch($event)">
          </metrics-episode-search>
          <metrics-episode-select-list-visibility
            [selectedEpisodes]="selectedEpisodes"
            [showingSelected]="showingSelected"
            (toggleShowSelected)="toggleShowingSelected.emit($event)">
          </metrics-episode-select-list-visibility>
        </div>
        <div *ngIf="!episodesLoading && searchTerm && !searchTotal" class="no-results">(no results)</div>
        <metrics-episode-select-list
          [episodes]="episodes"
          [episodesLoading]="episodesLoading"
          [selectedEpisodes]="selectedEpisodes"
          [showingSelected]="showingSelected"
          (selectEpisode)="onToggleSelectEpisode($event)"
          (loadEpisodes)="loadEpisodesOnScroll()">
        </metrics-episode-select-list>
        <hr>
        <div class="footer">
          <metrics-episode-select-accumulator
            [selectedEpisodes]="selectedEpisodes"
            [totalEpisodes]="totalEpisodes"
            (reset)="resetSelection()">
          </metrics-episode-select-accumulator>
          <button class="button" (click)="toggleOpen.emit(false)">Done</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../dropdown/dropdown.css', 'episode-select-dropdown-content.component.css']
})
export class EpisodeSelectDropdownContentComponent {
  @Input() routerParams: RouterParams;
  @Input() episodes: Episode[];
  @Input() searchTerm: string;
  @Input() episodesLoading: boolean;
  @Input() selectedEpisodes: string[];
  @Input() totalEpisodes: number;
  @Input() searchTotal: number;
  @Input() lastPage: number;
  @Input() maxPages: number;
  @Input() open: boolean;
  @Input() showingSelected: boolean;
  @Output() toggleOpen = new EventEmitter<boolean>();
  @Output() toggleShowingSelected = new EventEmitter<boolean>();

  constructor(private store: Store<any>) {}

  loadEpisodesOnScroll() {
    if (!this.episodesLoading &&
        this.lastPage + 1 <= this.maxPages) {
      this.loadEpisodes(this.lastPage + 1, this.searchTerm);
      this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-page-load', value: this.lastPage + 1}));
    }
  }

  loadEpisodesOnSearch(searchTerm: string) {
    this.loadEpisodes(1, searchTerm);
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

  resetSelection() {
    this.toggleShowingSelected.emit(false); // can't be showing selected after reset
    // should this close the dropdown?

    const { podcastId, metricsType, group, filter, interval, beginDate, endDate } = this.routerParams;
    if (metricsType !== METRICSTYPE_DROPDAY) {
      this.store.dispatch(new ACTIONS.CastlePodcastRanksLoadAction({
        podcastId,
        group,
        interval,
        beginDate,
        endDate
      }));
      this.store.dispatch(new ACTIONS.CastlePodcastTotalsLoadAction({
        podcastId,
        group,
        beginDate,
        endDate
      }));
      if (filter) {
        this.store.dispatch(new ACTIONS.CastlePodcastRanksLoadAction({
          podcastId,
          group: GROUPTYPE_GEOSUBDIV,
          filter,
          interval,
          beginDate,
          endDate
        }));
        this.store.dispatch(new ACTIONS.CastlePodcastTotalsLoadAction({
          podcastId,
          group: GROUPTYPE_GEOSUBDIV,
          filter,
          beginDate,
          endDate
        }));
      }
    }

    this.store.dispatch(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: null}));
    this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-reset'}));
  }

  onToggleSelectEpisode(episode: Episode) {
    let episodeGuids: string[];
    const { podcastId, metricsType, group, filter, interval, beginDate, endDate } = this.routerParams;
    if (!this.selectedEpisodes || this.selectedEpisodes.indexOf(episode.guid) === -1) {
      episodeGuids = this.selectedEpisodes ? this.selectedEpisodes.concat([episode.guid]) : [episode.guid];

      if (metricsType === METRICSTYPE_DROPDAY) {
        this.store.dispatch(new ACTIONS.CastleEpisodeDropdayLoadAction({
          podcastId,
          guid: episode.guid,
          interval,
          publishedAt: episode.publishedAt,
          days: this.routerParams.days
        }));
        this.store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
          podcastId,
          guid: episode.guid
        }));
      } else {
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
      }
    } else {
      episodeGuids = this.selectedEpisodes.filter(e => e !== episode.guid);
    }
    if (episodeGuids.length) {
      this.store.dispatch(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids}));
      this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select', value: episodeGuids.length}));
    } else {
      this.resetSelection();
    }
  }
}
