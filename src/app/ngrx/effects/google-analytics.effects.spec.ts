import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Action } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Subject, Observable } from 'rxjs';
import { Angulartics2 } from 'angulartics2';
import { reducers } from '../../ngrx/reducers';
import { GoogleAnalyticsEvent } from '../actions';
import { GoogleAnalyticsEffects } from './google-analytics.effects';

describe('GoogleAnalyticsEffects', () => {
  let effects: GoogleAnalyticsEffects;
  let actions$ = new Observable<Action>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers), RouterTestingModule, EffectsModule.forRoot([GoogleAnalyticsEffects])],
      providers: [
        GoogleAnalyticsEffects,
        { provide: Angulartics2, useValue: { eventTrack: new Subject<any>() } },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(GoogleAnalyticsEffects);
  }));

  it('should create Google Analytics event from action and track through angulartics2', () => {
    jest.spyOn(effects.angulartics2.eventTrack, 'next').mockImplementation(() => {});
    const action = GoogleAnalyticsEvent({ gaAction: 'itsafake', value: 42 });
    effects.store.dispatch(action);
    actions$ = hot('-a', { a: action });
    const expected = cold('-r', { r: undefined });
    expect(effects.fromGAEvent$).toBeObservable(expected);
    expect(effects.angulartics2.eventTrack.next).toHaveBeenCalled();
  });
});
