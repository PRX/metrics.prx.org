import { CustomRouterNavigation } from '../actions';
import { RouterParamsState, INTERVAL_DAILY, INTERVAL_HOURLY, CHARTTYPE_STACKED, METRICSTYPE_DOWNLOADS, GROUPTYPE_GEOCOUNTRY } from '../';
import { reducer as CustomRouterReducer } from './router.reducer';
import * as dateUtil from '@app/shared/util/date';

describe('CustomRouterReducer', () => {
  let newState: RouterParamsState;
  beforeEach(() => {
    newState = CustomRouterReducer(
      undefined,
      CustomRouterNavigation({
        routerParams: {
          podcastId: '70',
          beginDate: new Date(),
          endDate: new Date(),
          interval: INTERVAL_DAILY
        }
      })
    );
  });

  it('should update with new routerParams', () => {
    expect(newState.routerParams.podcastId).toEqual('70');
  });

  it('should update with new metrics type', () => {
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { metricsType: METRICSTYPE_DOWNLOADS } }));
    expect(newState.routerParams.metricsType).toEqual(METRICSTYPE_DOWNLOADS);
  });

  it('should update with new group', () => {
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { group: GROUPTYPE_GEOCOUNTRY } }));
    expect(newState.routerParams.group).toEqual(GROUPTYPE_GEOCOUNTRY);
  });

  it('should allow filter to be explicitly set to null', () => {
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: {} }));
    expect(newState.hasOwnProperty('filter')).toBeFalsy();
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { filter: 'US' } }));
    expect(newState.routerParams.filter).toEqual('US');
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { filter: undefined } }));
    expect(newState.routerParams.filter).toBeUndefined();
  });

  it('should update with new chart type', () => {
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { chartType: CHARTTYPE_STACKED } }));
    expect(newState.routerParams.chartType).toEqual(CHARTTYPE_STACKED);
  });

  it('should update with new interval', () => {
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { interval: INTERVAL_HOURLY } }));
    expect(newState.routerParams.interval.key).toEqual('hourly');
  });

  it('should update with new episode page', () => {
    newState = CustomRouterReducer(
      newState,
      CustomRouterNavigation({
        routerParams: {
          episodePage: 1
        }
      })
    );
    expect(newState.routerParams.episodePage).toEqual(1);
  });

  it('should update with new beginDate or endDate', () => {
    newState = CustomRouterReducer(
      newState,
      CustomRouterNavigation({
        routerParams: { beginDate: new Date('2017-08-26T10:00:00Z'), endDate: new Date('2017-09-10T12:00:00Z') }
      })
    );
    expect(newState.routerParams.beginDate.getDate()).toEqual(26);
  });

  it('should update standardRange value if begin or end dates are present', () => {
    newState = CustomRouterReducer(
      newState,
      CustomRouterNavigation({
        routerParams: {
          standardRange: dateUtil.THIS_WEEK,
          beginDate: dateUtil.beginningOfThisWeekUTC().toDate(),
          endDate: dateUtil.endOfTodayUTC().toDate()
        }
      })
    );
    expect(newState.routerParams.standardRange).toEqual(dateUtil.THIS_WEEK);
    newState = CustomRouterReducer(
      newState,
      CustomRouterNavigation({
        routerParams: { beginDate: dateUtil.beginningOfTodayUTC().subtract(18, 'days').toDate() }
      })
    );
    expect(newState.routerParams.standardRange).toBeUndefined();
  });

  it('should update with new days', () => {
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { days: 7 } }));
    expect(newState.routerParams.days).toEqual(7);
  });

  it('should retain other fields when updating', () => {
    expect(newState.routerParams.interval.key).toEqual('daily');
    expect(newState.routerParams.podcastId).toEqual('70');
    newState = CustomRouterReducer(newState, CustomRouterNavigation({ routerParams: { interval: INTERVAL_HOURLY } }));
    expect(newState.routerParams.interval.key).toEqual('hourly');
    expect(newState.routerParams.podcastId).toEqual('70');
  });
});
