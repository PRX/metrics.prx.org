import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Episode } from '../../ngrx';

@Component({
  selector: 'metrics-episode-search-list',
  template: `
    <ul>
      <li *ngFor="let episode of episodes">
        <button class="btn-link"
                [class.active]="selectedEpisodes && selectedEpisodes.indexOf(episode.guid) > -1"
                (click)="onEpisodeSelect(episode)">
          <div>{{episode.title}}</div>
          <div class="pub-date">{{episode.publishedAt | date:'EEE d MMM yyyy'}}</div>
        </button>
      </li>
    </ul>
    <prx-spinner *ngIf="episodesLoading"></prx-spinner>
  `,
  styleUrls: ['episode-search-list.component.css', '../dropdown/nav-list-dropdown.css']
})
export class EpisodeSearchListComponent {
  @Input() episodes: Episode[];
  @Input() episodesLoading: boolean;
  @Input() selectedEpisodes: string[];
  @Output() selectEpisode = new EventEmitter<Episode>();

  onEpisodeSelect(episode: Episode) {
    this.selectEpisode.emit(episode);
  }
}
