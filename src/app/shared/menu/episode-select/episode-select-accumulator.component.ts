import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'metrics-episode-select-accumulator',
  template: `
      <div *ngIf="totalEpisodes !== null" [class.muted]="selectedEpisodes?.length">
        {{ totalEpisodes | i18nPlural: {'=0': 'No episodes', '=1' : '1 episode', 'other' : '# episodes'} }}
      </div>
      <div *ngIf="selectedEpisodes?.length" class="separator"></div>
      <div *ngIf="selectedEpisodes?.length" class="accumulator">
        <span>{{ selectedEpisodes.length | i18nPlural: {'=1' : '1 episode', 'other' : '# episodes'} }} selected</span>
        <button class="btn-link" (click)="reset.emit()">(Clear Selection)</button>
      </div>
  `,
  styleUrls: ['episode-select-accumulator.component.css']
})
export class EpisodeSelectAccumulatorComponent {
  @Input() totalEpisodes: number;
  @Input() selectedEpisodes: string[];
  @Output() reset = new EventEmitter();
}
