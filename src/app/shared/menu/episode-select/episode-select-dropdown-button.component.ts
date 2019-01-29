import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'metrics-episode-select-dropdown-button',
  template: `
    <div class="dropdown-button" *ngIf="totalEpisodes !== null">
      <button (click)="toggleOpen.emit(!open)">
        <span *ngIf="totalEpisodes === 0">No Episodes</span>
        <span *ngIf="totalEpisodes > 0 && !selectedEpisodes?.length">All Episodes</span>
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
  @Input() totalEpisodes: number;
  @Input() selectedEpisodes: string[];
  @Input() open = false;
  @Output() toggleOpen = new EventEmitter<boolean>();
}
