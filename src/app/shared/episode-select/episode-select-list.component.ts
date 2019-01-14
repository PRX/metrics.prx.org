import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Episode } from '../../ngrx';

@Component({
  selector: 'metrics-episode-select-list',
  template: `
    <ul>
      <li *ngIf="selectedEpisodes && selectedEpisodes.length" class="accumulator">
        <button class="btn-link">
          {{ selectedEpisodes.length | i18nPlural: {'=1' : '1 episode', 'other' : '# episodes'} }} selected
        </button>
      </li>
      <li *ngIf="totalEpisodes" class="showall">
        <button class="btn-link"
                [class.active]="!selectedEpisodes || !selectedEpisodes.length"
                (click)="onEpisodeSelect(null)">
          <span *ngIf="selectedEpisodes && selectedEpisodes.length; else showing">Show all</span>
          <ng-template #showing>Showing</ng-template>
          {{totalEpisodes}} episodes
        </button>
      </li>
      <li class="divider" *ngIf="totalEpisodes"></li>
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
  styleUrls: ['episode-select-list.component.css', '../dropdown/nav-list-dropdown.css']
})
export class EpisodeSelectListComponent {
  @Input() episodes: Episode[];
  @Input() episodesLoading: boolean;
  @Input() selectedEpisodes: string[];
  @Input() totalEpisodes: number;
  @Output() selectEpisode = new EventEmitter<Episode>();

  onEpisodeSelect(episode: Episode) {
    this.selectEpisode.emit(episode);
  }
}
