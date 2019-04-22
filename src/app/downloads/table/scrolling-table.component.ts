import { Component, Input } from '@angular/core';

@Component({
  selector: 'metrics-downloads-scrolling-table',
  template: `
    <table class="scroll-x" *ngIf="tableData?.length">
      <thead>
        <tr>
          <th *ngFor="let heading of tableData[0]">{{heading}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of tableData.slice(1)">
          <td *ngFor="let data of row">{{data | largeNumber}}</td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['scrolling-table.component.css']
})

export class ScrollingTableComponent {
  @Input() tableData: any[][];
}
