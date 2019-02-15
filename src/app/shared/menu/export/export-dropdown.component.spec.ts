import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { reducers } from '../../../ngrx/reducers';
import { METRICSTYPE_DEMOGRAPHICS,  METRICSTYPE_TRAFFICSOURCES,
  GROUPTYPE_GEOCOUNTRY, GROUPTYPE_AGENTTYPE,
  CHARTTYPE_GEOCHART, CHARTTYPE_STACKED } from '../../../ngrx';
import { GoogleAnalyticsEventAction } from '../../../ngrx/actions';
import { ExportDropdownComponent } from './export-dropdown.component';

import * as dispatchHelper from '../../../../testing/dispatch.helpers';
import { podcastAgentTypeRanks, podcastAgentTypeDownloads } from '../../../../testing/downloads.fixtures';

describe('ExportDropdownComponent', () => {
  let comp: ExportDropdownComponent;
  let fix: ComponentFixture<ExportDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExportDropdownComponent
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
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
      dispatchHelper.dispatchRouterNavigation(store,
        {metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, chartType: CHARTTYPE_GEOCHART});
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
      dispatchHelper.dispatchRouterNavigation(store,
        {metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTTYPE, chartType: CHARTTYPE_STACKED});
      dispatchHelper.dispatchPodcastRanks(store,
        {group: GROUPTYPE_AGENTTYPE},
        podcastAgentTypeRanks, podcastAgentTypeDownloads);
      dispatchHelper.dispatchPodcastTotals(store,
        {group: GROUPTYPE_AGENTTYPE},
        podcastAgentTypeRanks);

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
    window.addEventListener('scroll', (e) => {
      expect(comp.open).toBeFalsy();
      done();
    });
    window.dispatchEvent(new Event('scroll'));
  });

  it('should dispatch google analytics actions onExportCsv', () => {
    jest.spyOn(store, 'dispatch');
    comp.onExportCsv();
    expect(store.dispatch).toHaveBeenCalledWith(new GoogleAnalyticsEventAction({gaAction: 'exportCSV'}));
  });
});
