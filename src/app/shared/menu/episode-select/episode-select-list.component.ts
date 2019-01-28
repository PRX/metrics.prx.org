import { Component, Input, Output, EventEmitter, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Episode } from '../../../ngrx';

@Component({
  selector: 'metrics-episode-select-list',
  template: `
    <ul>
      <li *ngFor="let episode of episodeList">
        <prx-checkbox
          small [checked]="selectedEpisodes && selectedEpisodes.indexOf(episode.guid) > -1" color="#0089bd"
          (change)="onEpisodeSelect(episode)">
          <div class="title">{{episode.title}}</div>
          <div class="pub-date">{{episode.publishedAt | date: 'longDate'}}</div>
        </prx-checkbox>
      </li>
    </ul>
    <prx-spinner *ngIf="episodesLoading"></prx-spinner>
  `,
  styleUrls: ['episode-select-list.component.css', '../../dropdown/nav-list-dropdown.css']
})
export class EpisodeSelectListComponent implements OnInit {
  @Input() episodes: Episode[];
  @Input() episodesLoading: boolean;
  @Input() selectedEpisodes: string[];
  @Input() showingSelected: boolean;
  @Output() selectEpisode = new EventEmitter<Episode>();
  @Output() loadEpisodes = new EventEmitter<{page: number, searchTerm: string}>();

  constructor(private el: ElementRef,
              private renderer: Renderer2) {}

  ngOnInit() {
    this.loadEpisodesOnScroll();
  }

  loadEpisodesOnScroll() {
    const element = this.el.nativeElement;
    this.renderer.listen(element, 'scroll', () => {
      // when scrollTop + clientHeight approaches scrollHeight, load the next page
      const { clientHeight, scrollHeight, scrollTop } = element;
      if (!this.episodesLoading &&
          scrollTop + clientHeight >= (scrollHeight - 100)) {
        this.loadEpisodes.emit();
      }
    });
  }

  onEpisodeSelect(episode: Episode) {
    this.selectEpisode.emit(episode);
  }

  get episodeList(): Episode[] {
    return this.showingSelected && this.episodes && this.selectedEpisodes ?
       this.episodes.filter(e => this.selectedEpisodes.indexOf(e.guid) > -1) : this.episodes;
  }
}
