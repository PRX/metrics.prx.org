import { Component, Input } from '@angular/core';

@Component({
  selector: 'metrics-downloads-summary-item',
  template: `
    <div class="label">{{ label }}</div>
    <div class="value">{{ value | largeNumber }}</div>
  `,
  styleUrls: ['./downloads-summary-item.component.css']
})

export class DownloadsSummaryItemComponent {
  @Input() label: string;
  @Input() value: number;
}
