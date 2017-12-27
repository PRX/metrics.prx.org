import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { getActions, TestActions } from './test.actions';
import { INTERVAL_HOURLY } from '../../ngrx';
import { reducers } from '../../ngrx/reducers';
import { CastleFilterAction, CastlePodcastChartToggleAction, CastleEpisodeChartToggleAction } from '../actions';
import { RoutingEffects } from './routing.effects';
import { beginningOfThreeMonthsUTC, endOfTodayUTC, THREE_MONTHS } from '../../shared/util/date.util';

describe('RoutingEffects', () => {
  let effects: RoutingEffects;
  let actions$: TestActions;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({...reducers, routerReducer: routerReducer}),
        EffectsModule.forRoot([RoutingEffects]),
      ],
      providers: [
        RoutingEffects,
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(RoutingEffects);
    actions$ = TestBed.get(Actions);
  }));

  it('should provide filter for begin and end date corresponding to standard range when dates not present', () => {
    const action = {
      type: ROUTER_NAVIGATION,
      payload: {
        routerState: {
          url: '/37800/downloads/hourly;' +
          'standardRange=3%20months;' +
          'episodes=123,1234',
          root: {
            firstChild: {
              params: {
                seriesId: '37800',
                interval: 'hourly',
                page: '1',
                standardRange: THREE_MONTHS
              }
            }
          }
        }
      }
    };
    const result = new CastleFilterAction({filter: {
      podcastSeriesId: 37800,
      page: 1,
      interval: INTERVAL_HOURLY,
      beginDate: beginningOfThreeMonthsUTC().toDate(),
      endDate: endOfTodayUTC().toDate(),
      standardRange: THREE_MONTHS
    }});
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: result });
    expect(effects.filterFromRoute$).toBeObservable(expected);
  });

  describe('routing to specific begin and end dates', () => {
    let expected;

    beforeEach(() => {
      // not sure how to get RouterNavigationAction from comp.router.navigate but it should look like this
      const action = {
        type: ROUTER_NAVIGATION,
        payload: {
          routerState: {
            url: '/37800/downloads/hourly;' +
            'beginDate=2017-11-09T00:00:00.000Z;endDate=2017-11-09T22:00:00.000Z;' +
            'episodes=123,1234,chartPodcast=true',
            root: {
              firstChild: {
                params: {
                  seriesId: '37800',
                  interval: 'hourly',
                  page: '1',
                  beginDate: '2017-11-01T00:00:00.000Z',
                  endDate: '2017-11-01T22:00:00.000',
                  episodes: '123,1234',
                  chartPodcast: 'true'
                }
              }
            }
          }
        }
      };
      const result = new CastleFilterAction({filter: {
        podcastSeriesId: 37800,
        page: 1,
        interval: INTERVAL_HOURLY,
        beginDate: new Date('2017-11-01T00:00:00.000Z'),
        endDate: new Date('2017-11-01T22:00:00.000'),
        standardRange: undefined
      }});
      actions$.stream = hot('-a', { a: action });
      expected = cold('-r', { r: result });
    });

    it('should create a CastleFilterAction from a RouterNavigationAction', () => {
      expect(effects.filterFromRoute$).toBeObservable(expected);
    });

    it('should dispatch toggle chart podcast and episode actions', () => {
      spyOn(effects.store, 'dispatch').and.callThrough();
      expect(effects.filterFromRoute$).toBeObservable(expected);
      expect(effects.store.dispatch).toHaveBeenCalledWith(jasmine.any(CastlePodcastChartToggleAction));
      expect(effects.store.dispatch).toHaveBeenCalledWith(jasmine.any(CastleEpisodeChartToggleAction));
    });
  });
});
