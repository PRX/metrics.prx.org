import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ExportGoogleSheetsService } from './export-google-sheets.service';

@Component({
  selector: 'metrics-export-google-sheets',
  template: `
    <button class="btn-link" *ngIf="!isSignedIn; else export"
      (click)="signIn()">Sign In for Google Sheets</button>
    <ng-template #export>
      <button class="btn-link" (click)="createSpreadsheet()">Google Sheets</button>
    </ng-template>
  `
})

export class ExportGoogleSheetsComponent {
  @Input() exportData: string[][];
  @Input() exportFilename: string;
  // this event emitter is just to let the parent component know export was clicked (to close dropdown and do Google analytics)
  @Output() export = new EventEmitter();

  constructor(private googleSheets: ExportGoogleSheetsService) {}

  get isSignedIn(): boolean { return this.googleSheets.isSignedIn; }

  signIn() { this.googleSheets.signIn(); }

  createSpreadsheet() {
    this.export.emit();
    this.googleSheets.createSpreadsheet({
      title: this.exportFilename || 'Downloads',
      sheets: [{title: 'Downloads', data: this.exportData}]
    });
  }
}
