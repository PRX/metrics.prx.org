import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Episode } from '../../ngrx';

@Component({
  selector: 'metrics-episode-select-list',
  template: `
    <ul>
      <li *ngIf="selectedEpisodes && selectedEpisodes.length">
        <span class="accumulator">{{ selectedEpisodes.length | i18nPlural: {'=1' : '1 episode', 'other' : '# episodes'} }} selected</span>
      </li>
      <li *ngIf="totalEpisodes">
        <prx-checkbox
          small [checked]="!selectedEpisodes || !selectedEpisodes.length" color="#0089bd"
          (change)="onEpisodeSelect(null)">
          <span *ngIf="selectedEpisodes && selectedEpisodes.length; else showing">Show</span>
          <ng-template #showing><span>Showing</span></ng-template>
          <span>all {{totalEpisodes}} episodes</span>
        </prx-checkbox>
      </li>
      <li class="divider" *ngIf="totalEpisodes"></li>
      <li *ngFor="let episode of episodes">
        <prx-checkbox
          small [checked]="selectedEpisodes && selectedEpisodes.indexOf(episode.guid) > -1" color="#0089bd"
          (change)="onEpisodeSelect(episode)">
          <div class="title">{{episode.title}}</div>
          <div class="pub-date">{{episode.publishedAt | date:'EEE d MMM yyyy'}}</div>
        </prx-checkbox>
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
