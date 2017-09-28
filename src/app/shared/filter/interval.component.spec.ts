import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SelectModule } from 'ngx-prx-styleguide';
import { IntervalComponent } from './interval.component';

import { reducers } from '../../ngrx/reducers/reducers';

import { FilterModel, INTERVAL_DAILY } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

describe('IntervalComponent', () => {
  let comp: IntervalComponent;
  let fix: ComponentFixture<IntervalComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let filter: FilterModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IntervalComponent
      ],
      imports: [
        SelectModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(IntervalComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      const today = new Date();
      const utcEndDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
      const utcBeginDate = new Date(utcEndDate.valueOf() - (14 * 24 * 60 * 60 * 1000) + 1); // 14 days prior at 0:0:0
      filter = {
        beginDate: utcBeginDate,
        endDate: utcEndDate,
        interval: INTERVAL_DAILY
      };
      comp.store.dispatch(new CastleFilterAction({filter}));
    });
  }));

  it('should initialize interval according to default filter', () => {
    expect(comp.selectedInterval).toEqual(INTERVAL_DAILY);
  });

  it('should limit interval according to begin and end dates', () => {
    expect(comp.intervalOptions.length).toEqual(2); // DAILY and HOURLY
  });
});
