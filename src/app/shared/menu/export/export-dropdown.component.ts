import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleAnalyticsEventAction } from '../../../ngrx/actions';
import { selectExportData2DArray, joinCsvArray } from '../../../ngrx/reducers/selectors';
import { ExportGoogleSheetsService } from './export-google-sheets.service';

@Component({
  selector: 'metrics-export-dropdown',
  template: `
    <prx-spinner *ngIf="googleSheetsBusy$ | async" overlay="true"></prx-spinner>
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()">Export<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout left short" *ngIf="(exportData$ | async)?.length">
        <ul>
          <li><a [href]="exportDataCsv$ | async" (click)="onExportCsv()" download="downloads.csv">CSV</a></li>
          <li class="hide">
            <metrics-export-google-sheets
              [exportData]="exportData$ | async"
              (export)="onExportGoogleSheet()">
            </metrics-export-google-sheets>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['../../dropdown/dropdown.css', 'export-dropdown.component.css']
})
export class ExportDropdownComponent implements OnInit {
  exportData$ = new Observable<string[][]>();
  exportDataCsv$ = new Observable<SafeUrl>();
  open = false;
  // because of relative/absolute positioning, the spinner needs to be outside the dropdown DOM, so we listen for busy here
  googleSheetsBusy$ = new Observable<boolean>();
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  constructor(private store: Store<any>,
              private sanitizer: DomSanitizer,
              private googleSheets: ExportGoogleSheetsService) {}

  ngOnInit() {
    this.exportData$ = this.store.pipe(select(selectExportData2DArray));
    this.exportDataCsv$ =
      this.exportData$.pipe(map(data => this.sanitizer.bypassSecurityTrustUrl(joinCsvArray(data))));
    this.googleSheetsBusy$ = this.googleSheets.busy;
  }

  toggleOpen() {
    this.open = !this.open;
  }

  onExportCsv() {
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'exportCSV'}));

    this.toggleOpen();
  }

  onExportGoogleSheet() {
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'exportGoogleSheet'}));

    this.toggleOpen();
  }
}
