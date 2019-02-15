import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'ngx-prx-styleguide';
import { ExportGoogleSheetsService, GoogleSheet } from './export-google-sheets.service';

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
  @Output() created = new EventEmitter<boolean>();

  constructor(private googleSheets: ExportGoogleSheetsService,
              private modal: ModalService) {}

  get isSignedIn(): boolean { return this.googleSheets.isSignedIn; }

  signIn() { this.googleSheets.signIn(); }

  createSpreadsheet() {
    this.googleSheets.createSpreadsheet({
      title: 'Downloads',
      sheets: [{title: 'Downloads', data: this.exportData}]
    }).subscribe((result: GoogleSheet) => {
      this.created.emit(!!result.spreadsheetId);
      let modalContent;
      if (result.error) {
        modalContent = {
          title: 'Google Sheet Error',
          body: `
            Error creating Google Sheet:
            <pre>${result.error}</pre>
          `,
          primaryButton: 'Okay'
        };
      } else {
        modalContent = {
          title: 'Google Sheet Created',
          body: `
            Your Google Sheet was created and is available at
            <a target="_blank" rel="noopener noreferrer" href="${result.spreadsheetUrl}">${result.spreadsheetUrl}</a>.
          `,
          primaryButton: 'Okay'
        };
      }
      this.modal.show(modalContent);
    });
  }
}
