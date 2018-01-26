import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers } from '../../ngrx/reducers';

import { CustomRouterNavigationAction } from '../../ngrx/actions';
import { RouterModel, ChartType, CHARTTYPE_PODCAST, INTERVAL_DAILY } from '../../ngrx';
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
    });
  }));

  it('should have routerState', () => {
    let result;
    comp.routerState$.subscribe(value => result = value);
    expect(result).toEqual(routerState);
  });

  it('should have chart type', () => {
    let result;
    comp.chartType$.subscribe(value => result = value);
    expect(result).toEqual(CHARTTYPE_PODCAST);
  });

  it('should have interval', () => {
    let result;
    comp.interval$.subscribe(value => result = value);
    expect(result).toEqual(INTERVAL_DAILY);
  });

  it('should have standard range', () => {
    let result;
    comp.standardRange$.subscribe(value => result = value);
    expect(result).toEqual(dateUtil.THIS_WEEK);
  });
});
