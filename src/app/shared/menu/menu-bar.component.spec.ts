import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers } from '../../ngrx/reducers';

import { CustomRouterNavigationAction } from '../../ngrx/actions';
import { RouterModel, INTERVAL_DAILY, INTERVAL_MONTHLY } from '../../ngrx';
import * as dateUtil from '../util/date';

import { MenuBarComponent } from './menu-bar.component';
import { ChartTypeComponent } from './chart-type.component';
import { CustomDateRangeDropdownComponent } from './date/custom-date-range-dropdown.component';
import { DateRangeSummaryComponent } from './date/date-range-summary.component';
import { IntervalDropdownComponent } from './interval-dropdown.component';
import { StandardDateRangeDropdownComponent } from './date/standard-date-range-dropdown.component';
import { StandardDateRangeComponent } from './date/standard-date-range.component';
import { DownloadsSummaryContainerComponent } from '../summary/downloads-summary-container.component';
import { DownloadsSummaryItemComponent } from '../summary/downloads-summary-item.component';
import { LargeNumberPipe } from '../pipes/large-number.pipe';
import { DatepickerModule } from 'ngx-prx-styleguide';

describe('MenuBarComponent', () => {
  let comp: MenuBarComponent;
  let fix: ComponentFixture<MenuBarComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  const routerState: RouterModel = {
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
        DownloadsSummaryContainerComponent,
        DownloadsSummaryItemComponent,
        IntervalDropdownComponent,
        LargeNumberPipe,
        StandardDateRangeComponent,
        StandardDateRangeDropdownComponent
      ],
      imports: [
        DatepickerModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(MenuBarComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      store.dispatch(new CustomRouterNavigationAction({routerState}));

      spyOn(comp, 'googleAnalyticsEvent').and.callThrough();
    });
  }));

  xit('keeps standard range in sync with custom range', () => {
    comp.onAdvancedChange({beginDate: dateUtil.beginningOfLastWeekUTC().toDate(), endDate: dateUtil.endOfLastWeekUTC().toDate()});
    let result;
    comp.routerState$.subscribe(r => result = r);
    expect(routerState.standardRange).toEqual(dateUtil.LAST_WEEK);
  });

  xit('keeps date range in sync with interval', () => {
    store.dispatch(new CustomRouterNavigationAction({routerState: {beginDate: dateUtil.beginningOfTodayUTC().toDate()}}));
    comp.onIntervalChange(INTERVAL_MONTHLY);
    let result;
    comp.routerState$.subscribe(r => result = r);
    expect(result.beginDate.valueOf()).toEqual(dateUtil.beginningOfThisMonthUTC().valueOf());
    expect(result.standardRange).toEqual(dateUtil.THIS_MONTH);
  });

  it('should send google analytics event when standard range is changed', () => {
    comp.onStandardRangeChange(dateUtil.LAST_WEEK);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalled();
  });
});
