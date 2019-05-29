import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MetricsType, METRICSTYPE_DROPDAY } from '@app/ngrx';

@Component({
  selector: 'metrics-episode-select-dropdown-button',
  template: `
    <div class="dropdown-button" *ngIf="totalEpisodes !== null">
      <button (click)="toggleOpen.emit(!open)">
        <span *ngIf="totalEpisodes === 0">No Episodes</span>
        <span *ngIf="totalEpisodes > 0 && !selectedEpisodes?.length">{{ noEpisodesSelectedText }}</span>
        <span *ngIf="totalEpisodes > 0 && selectedEpisodes?.length">
          {{ selectedEpisodes.length | i18nPlural: {'=1' : '1 Episode', 'other' : '# Episodes'} }} Selected
        </span>
        <img class="filter" src="/assets/images/ic_filter.svg" aria-hidden>
      </button>
    </div>
  `,
  styleUrls: ['../../dropdown/dropdown.css']
})
export class EpisodeSelectDropdownButtonComponent {
  @Input() metricsType: MetricsType;
  @Input() totalEpisodes: number;
  @Input() selectedEpisodes: string[];
  @Input() open = false;
  @Output() toggleOpen = new EventEmitter<boolean>();

  get noEpisodesSelectedText(): string {
    if (this.metricsType === METRICSTYPE_DROPDAY) {
      return 'No Episodes Selected'; // none selected
    } else {
      return 'All Episodes'; // no aggregate episode filter
    }
  }
}
