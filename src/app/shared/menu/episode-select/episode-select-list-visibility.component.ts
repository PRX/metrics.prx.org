import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'metrics-episode-select-list-visibility',
  template: `
    <button class="btn-link"
      [class.active]="!showingSelected"
      (click)="toggleShowSelected.emit(false)">Show All</button>
    <button class="btn-link"
      [class.active]="showingSelected"
      [disabled]="!selectedEpisodes || !selectedEpisodes.length"
      (click)="selectedEpisodes?.length && toggleShowSelected.emit(true)">Show Selected</button>
  `,
  styleUrls: ['episode-select-list-visibility.component.css']
})
export class EpisodeSelectListVisibilityComponent {
  @Input() selectedEpisodes: string[];
  @Input() showingSelected: boolean;
  @Output() toggleShowSelected = new EventEmitter<boolean>();
}
