import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By, DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ModalService } from 'ngx-prx-styleguide';

import { ExportGoogleSheetsComponent } from './export-google-sheets.component';
import { ExportGoogleSheetsService, GoogleSheetState } from './export-google-sheets.service';

const exportState = new BehaviorSubject<GoogleSheetState>({signedIn: true, busy: false});

class MockExportGoogleSheetsService extends ExportGoogleSheetsService {
  public readonly state: Observable<GoogleSheetState> = exportState.asObservable();
}

describe('ExportGoogleSheetsComponent', () => {
  let comp: ExportGoogleSheetsComponent;
  let fix: ComponentFixture<ExportGoogleSheetsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let googleSheets: ExportGoogleSheetsService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExportGoogleSheetsComponent
      ],
      providers: [
        {provide: ExportGoogleSheetsService, useClass: MockExportGoogleSheetsService},
        {provide: ModalService, useValue: {show: () => {}}}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(ExportGoogleSheetsComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      googleSheets = TestBed.get(ExportGoogleSheetsService);
      modalService = TestBed.get(ModalService);
    });
  }));

  it('should sign in to Google', () => {
    jest.spyOn(googleSheets, 'signIn');
    const signInButton = de.query(By.css('button.btn-link'));
    expect(signInButton.nativeElement.textContent).toContain('Sign In');
    signInButton.nativeElement.click();
    expect(googleSheets.signIn).toHaveBeenCalled();
  });

  it('should emit export when clicked to create a spreadsheet', () => {
    jest.spyOn(comp.export, 'emit');
    jest.spyOn(googleSheets, 'createSpreadsheet');
    comp.exportData = [
      ['Title', 'Release Date', 'Total Downloads'],
      ['Episode 10', '2019-02-19', '3500'],
      ['Episode 9', '2019-02-12', '4700'],
      ['Episode 8', '2019-02-05', '4800']
    ];
    comp.createSpreadsheet();
    expect(comp.export.emit).toHaveBeenCalled();
    expect(googleSheets.createSpreadsheet).toHaveBeenCalled();
  });
});
