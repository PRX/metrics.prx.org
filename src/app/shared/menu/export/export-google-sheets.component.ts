import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalService } from 'ngx-prx-styleguide';
import { ExportGoogleSheetsService, GoogleSheetState } from './export-google-sheets.service';

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

export class ExportGoogleSheetsComponent implements OnInit {
  @Input() exportData: string[][];
  // this event emitter is just to let the parent component know export was clicked (to close dropdown and do Google analytics)
  @Output() export = new EventEmitter();

  constructor(private googleSheets: ExportGoogleSheetsService,
              private modal: ModalService) {}

  ngOnInit() {
    this.waitForResult();
  }

  get isSignedIn(): boolean { return this.googleSheets.isSignedIn; }

  signIn() { this.googleSheets.signIn(); }

  createSpreadsheet() {
    this.export.emit();
    this.googleSheets.createSpreadsheet({
      title: 'Downloads',
      sheets: [{title: 'Downloads', data: this.exportData}]
    });
  }

  waitForResult() {
    this.googleSheets.state.subscribe((state: GoogleSheetState) => {
      let modalContent;
      if (state.error) {
        modalContent = {
          title: 'Google Sheet Error',
          body: `
            Error creating Google Sheet:
            <pre>${state.error}</pre>
          `,
          primaryButton: 'Okay'
        };
      } else if (state.sheet && state.sheet.spreadsheetUrl && !state.busy) {
        modalContent = {
          title: 'Google Sheet Created',
          body: `
            Your Google Sheet was created and is available at
            <a target="_blank" rel="noopener noreferrer" href="${state.sheet.spreadsheetUrl}">${state.sheet.spreadsheetUrl}</a>.
          `,
          primaryButton: 'Okay'
        };
      }

      if (modalContent) {
        this.modal.show(modalContent);
      }
    });
  }
}
