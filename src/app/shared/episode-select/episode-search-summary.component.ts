import { Component, Input } from '@angular/core';

@Component({
  selector: 'metrics-episode-search-summary',
  template: `
    <span *ngIf="searchTotal; else noresults">
      ({{searchTotal}} episodes)
    </span>
    <ng-template #noresults>
      (no results)
    </ng-template>
  `
})
export class EpisodeSearchSummaryComponent {
  @Input() searchTotal: number;
}
