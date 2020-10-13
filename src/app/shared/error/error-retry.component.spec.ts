import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Store, StoreModule, Action } from '@ngrx/store';

import { ErrorRetryComponent } from './error-retry.component';
import * as ACTIONS from '../../ngrx/actions';
import { reducers } from '../../ngrx/reducers';
import { routerParams } from '../../../testing/downloads.fixtures';

describe('ErrorRetryComponent', () => {
  let comp: ErrorRetryComponent;
  let fix: ComponentFixture<ErrorRetryComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorRetryComponent],
      imports: [StoreModule.forRoot(reducers)],
      providers: []
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(ErrorRetryComponent);
        comp = fix.componentInstance;
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);
      });
  }));

  function setRetryActions() {
    comp.retryActions = ([
      ACTIONS.CastlePodcastDownloadsLoad({
        id: routerParams.podcastId,
        interval: routerParams.interval,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate
      })
    ] as any[]) as Action[];
    fix.detectChanges();
  }

  it('should show Retry button when retryActions is provided', () => {
    expect(de.query(By.css('button'))).toBeNull();
    setRetryActions();
    expect(de.query(By.css('button'))).not.toBeNull();
  });

  it('should dispatch retry action when Retry button is clicked', () => {
    setRetryActions();
    jest.spyOn(store, 'dispatch');
    de.query(By.css('button')).nativeElement.click();
    expect(store.dispatch).toHaveBeenCalledWith(comp.retryActions[0]);
  });
});
