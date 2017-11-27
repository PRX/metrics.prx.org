import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { Subject } from 'rxjs/Subject';
import { Angulartics2 } from 'angulartics2';
import { getActions, TestActions } from './test.actions';
import { reducers } from '../../ngrx/reducers';
import { GoogleAnalyticsEventAction } from '../actions';
import { GoogleAnalyticsEffects } from './google-analytics.effects';

describe('GoogleAnalyticsEffects', () => {
  let effects: GoogleAnalyticsEffects;
  let actions$: TestActions;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        RouterTestingModule,
        EffectsModule.forRoot([GoogleAnalyticsEffects])
      ],
      providers: [
        GoogleAnalyticsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: Angulartics2, useValue: {eventTrack: new Subject<any>()} },
      ]
    });

    effects = TestBed.get(GoogleAnalyticsEffects);
    actions$ = TestBed.get(Actions);
  }));

  it('should create Google Analytics event from action and track through angulartics2', () => {
    spyOn(effects.angulartics2.eventTrack, 'next');
    const action = new GoogleAnalyticsEventAction({gaAction: 'itsafake', value: 42});
    effects.store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: undefined });
    expect(effects.fromGAEvent$).toBeObservable(expected);
    expect(effects.angulartics2.eventTrack.next).toHaveBeenCalled();
  });
});
