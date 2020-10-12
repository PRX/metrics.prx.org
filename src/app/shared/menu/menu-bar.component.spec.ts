import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { reducers } from '../../ngrx/reducers';

import { CustomRouterNavigation } from '../../ngrx/actions';
import { RouterParams, ChartType, CHARTTYPE_PODCAST, INTERVAL_DAILY } from '../../ngrx';
import * as dateUtil from '../util/date';

import { MenuBarComponent } from './menu-bar.component';
import { MetricsTypeHeadingComponent } from './metrics-type-heading.component';
import { ChartTypeComponent } from './chart-type.component';
import { CustomDateRangeDropdownComponent } from './date/custom-date-range-dropdown.component';
import { DateRangeSummaryComponent } from './date/date-range-summary.component';
import { DaysDropdownComponent } from './days-dropdown.component';
import { IntervalDropdownComponent } from './interval-dropdown.component';
import { StandardDateRangeDropdownComponent } from './date/standard-date-range-dropdown.component';
import { StandardDateRangeComponent } from './date/standard-date-range.component';
import { EpisodeSelectComponent } from './episode-select/episode-select.component';
import { EpisodeSelectDropdownButtonComponent } from './episode-select/episode-select-dropdown-button.component';
import { EpisodeSelectDropdownService } from './episode-select/episode-select-dropdown.service';
import { ExportDropdownComponent } from './export/export-dropdown.component';
import { ExportGoogleSheetsComponent } from './export/export-google-sheets.component';
import { ExportGoogleSheetsService } from './export/export-google-sheets.service';
import { DownloadsSummaryComponent } from '../summary/downloads-summary.component';
import { LargeNumberPipe } from '../pipes/large-number.pipe';
import { DatepickerModule, FancyFormModule, SpinnerModule } from 'ngx-prx-styleguide';

describe('MenuBarComponent', () => {
  let comp: MenuBarComponent;
  let fix: ComponentFixture<MenuBarComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  const url = '/70/reach/podcast/daily;episodePage=1;standardRange=This%20Week';
  const routerParams: RouterParams = {
    chartType: <ChartType>CHARTTYPE_PODCAST,
    interval: INTERVAL_DAILY,
    standardRange: dateUtil.THIS_WEEK,
    beginDate: dateUtil.beginningOfThisWeekUTC().toDate(),
    endDate: dateUtil.endOfTodayUTC().toDate()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuBarComponent,
        ChartTypeComponent,
        CustomDateRangeDropdownComponent,
        DateRangeSummaryComponent,
        DaysDropdownComponent,
        DownloadsSummaryComponent,
        EpisodeSelectComponent,
        EpisodeSelectDropdownButtonComponent,
        ExportDropdownComponent,
        ExportGoogleSheetsComponent,
        IntervalDropdownComponent,
        LargeNumberPipe,
        MetricsTypeHeadingComponent,
        StandardDateRangeComponent,
        StandardDateRangeDropdownComponent
      ],
      imports: [DatepickerModule, FancyFormModule, SpinnerModule, StoreModule.forRoot(reducers)],
      providers: [EpisodeSelectDropdownService, ExportGoogleSheetsService]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(MenuBarComponent);
        comp = fix.componentInstance;
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        store.dispatch(CustomRouterNavigation({ url, routerParams }));
        fix.detectChanges();
      });
  }));

  it('should have routerParams', done => {
    comp.routerParams$.pipe(first()).subscribe(result => {
      expect(result).toEqual(routerParams);
      done();
    });
  });
});
