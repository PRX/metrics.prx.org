import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { selectExportData, toCsvArray, joinCsvArray } from '../../../ngrx/reducers/selectors';
import { ExportData } from '../../../ngrx';

@Component({
  selector: 'metrics-export-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()">Export<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout left short" *ngIf="(exportData$ | async)?.length">
        <ul>
          <li><a [href]="exportDataCsv$ | async" (click)="onExportCsv()" download="downloads.csv">CSV</a></li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['../../dropdown/dropdown.css', './export-dropdown.component.css']
})
export class ExportDropdownComponent implements OnInit {
  exportData$ = new Observable<ExportData[]>();
  exportDataCsv$ = new Observable<SafeUrl>();
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  ngOnInit() {
    this.exportData$ = this.store.pipe(select(selectExportData));
    this.exportDataCsv$ =
      this.exportData$.pipe(map(data => this.sanitizer.bypassSecurityTrustUrl(joinCsvArray(toCsvArray(data)))));
  }

  constructor(private store: Store<any>,
              private sanitizer: DomSanitizer) {}

  toggleOpen() {
    this.open = !this.open;
  }

  onExportCsv() {
    // google analytics

    this.toggleOpen();
  }
}
