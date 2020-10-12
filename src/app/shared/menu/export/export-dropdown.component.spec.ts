import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { reducers } from '../../../ngrx/reducers';
import {
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_TRAFFICSOURCES,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_AGENTTYPE,
  CHARTTYPE_GEOCHART,
  CHARTTYPE_STACKED
} from '../../../ngrx';
import { GoogleAnalyticsEvent } from '../../../ngrx/actions';
import { ExportDropdownComponent } from './export-dropdown.component';
import { ExportGoogleSheetsComponent } from './export-google-sheets.component';
import { ExportGoogleSheetsService } from './export-google-sheets.service';

import { ModalService, SpinnerModule } from 'ngx-prx-styleguide';
import * as dispatchHelper from '../../../../testing/dispatch.helpers';
import { podcastAgentTypeRanks, podcastAgentTypeDownloads } from '../../../../testing/downloads.fixtures';

describe('ExportDropdownComponent', () => {
  let comp: ExportDropdownComponent;
  let fix: ComponentFixture<ExportDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;
  const googleSheetBusy$ = new BehaviorSubject(false);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportDropdownComponent, ExportGoogleSheetsComponent],
      imports: [SpinnerModule, StoreModule.forRoot(reducers)],
      providers: [
        {
          provide: ExportGoogleSheetsService,
          useValue: {
            state: new BehaviorSubject({}),
            busy: googleSheetBusy$,
            signIn: () => {},
            createSpreadsheet: () => {}
          }
        },
        ModalService
      ]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(ExportDropdownComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.get(Store);
      });
  }));

  describe('Download exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store);
      dispatchHelper.dispatchPodcasts(store);
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchPodcastDownloads(store);
      dispatchHelper.dispatchEpisodeDownloads(store);

      fix.detectChanges();
    });

    it('should have a link to download CSV data', () => {
      const link = de.query(By.css('a[download]'));
      expect(link).not.toBeNull();
      expect(link.nativeElement.href).toContain('data:text/csv;charset=utf-8');
    });
  });

  describe('Demographics exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_GEOCOUNTRY,
        chartType: CHARTTYPE_GEOCHART
      });
      dispatchHelper.dispatchPodcastRanks(store);
      dispatchHelper.dispatchPodcastTotals(store);

      fix.detectChanges();
    });

    it('should have a link to download CSV data', () => {
      const link = de.query(By.css('a[download]'));
      expect(link).not.toBeNull();
      expect(link.nativeElement.href).toContain('data:text/csv;charset=utf-8');
    });
  });

  describe('Devices exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_AGENTTYPE,
        chartType: CHARTTYPE_STACKED
      });
      dispatchHelper.dispatchPodcastRanks(store, { group: GROUPTYPE_AGENTTYPE }, podcastAgentTypeRanks, podcastAgentTypeDownloads);
      dispatchHelper.dispatchPodcastTotals(store, { group: GROUPTYPE_AGENTTYPE }, podcastAgentTypeRanks);

      fix.detectChanges();
    });

    it('should have a link to download CSV data', () => {
      const link = de.query(By.css('a[download]'));
      expect(link).not.toBeNull();
      expect(link.nativeElement.href).toContain('data:text/csv;charset=utf-8');
    });
  });

  it('should close the dropdown on window scroll', done => {
    comp.open = true;
    window.addEventListener('scroll', e => {
      expect(comp.open).toBeFalsy();
      done();
    });
    window.dispatchEvent(new Event('scroll'));
  });

  it('should dispatch google analytics action onExportCsv', () => {
    jest.spyOn(store, 'dispatch');
    comp.onExportCsv();
    expect(store.dispatch).toHaveBeenCalledWith(GoogleAnalyticsEvent({ gaAction: 'exportCSV' }));
  });

  it('should dispatch google analytics action when finished creating Google Sheet', () => {
    jest.spyOn(store, 'dispatch');
    expect(store.dispatch).not.toHaveBeenCalled();
    comp.onExportGoogleSheet();
    expect(store.dispatch).toHaveBeenCalledWith(GoogleAnalyticsEvent({ gaAction: 'exportGoogleSheet' }));
  });

  it('should show spinner when GoogleSheets service is busy creating a sheet', () => {
    googleSheetBusy$.next(true);
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner')).nativeElement).not.toBeNull();
  });
});
