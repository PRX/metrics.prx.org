import { CustomRouterNavigationAction } from '../actions';
import { RouterParams, INTERVAL_DAILY, INTERVAL_HOURLY, CHARTTYPE_STACKED, METRICSTYPE_DOWNLOADS, GROUPTYPE_GEOCOUNTRY } from '../';
import { CustomRouterReducer } from './router.reducer';
import * as dateUtil from '../../shared/util/date';

describe('CustomRouterReducer', () => {
  let newState: RouterParams;
  beforeEach(() => {
    newState = CustomRouterReducer(undefined,
      new CustomRouterNavigationAction({
        routerParams: {
          podcastId: '70',
          beginDate: new Date(),
          endDate: new Date(),
          interval: INTERVAL_DAILY
        }
      }));
  });

  it('should update with new routerParams', () => {
    expect(newState.podcastId).toEqual('70');
  });

  it ('should update with new metrics type', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {metricsType: METRICSTYPE_DOWNLOADS}}));
    expect(newState.metricsType).toEqual(METRICSTYPE_DOWNLOADS);
  });

  it ('should update with new group', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {group: GROUPTYPE_GEOCOUNTRY}}));
    expect(newState.group).toEqual(GROUPTYPE_GEOCOUNTRY);
  });

  it ('should allow filter to be explicitly set to null', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {}}));
    expect(newState.hasOwnProperty('filter')).toBeFalsy();
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {filter: 'US'}}));
    expect(newState.filter).toEqual('US');
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {filter: undefined}}));
    expect(newState.filter).toBeUndefined();
  });

  it ('should update with new chart type', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {chartType: CHARTTYPE_STACKED}}));
    expect(newState.chartType).toEqual(CHARTTYPE_STACKED);
  });

  it ('should update with new interval', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {interval: INTERVAL_HOURLY}}));
    expect(newState.interval.key).toEqual('hourly');
  });

  it('should update with new episode page', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({
        routerParams: {
          episodePage: 1
        }
      }));
    expect(newState.episodePage).toEqual(1);
  });

  it ('should update with new beginDate or endDate', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams:
        {beginDate: new Date('2017-08-26T10:00:00Z'), endDate: new Date('2017-09-10T12:00:00Z')}}));
    expect(newState.beginDate.getDate()).toEqual(26);
  });

  it('should update standardRange value if begin or end dates are present', () => {
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {
        standardRange: dateUtil.THIS_WEEK,
        beginDate: dateUtil.beginningOfThisWeekUTC().toDate(),
        endDate: dateUtil.endOfTodayUTC().toDate()}
      }));
    expect(newState.standardRange).toEqual(dateUtil.THIS_WEEK);
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {beginDate: dateUtil.beginningOfTodayUTC().subtract(18, 'days').toDate()}}));
    expect(newState.standardRange).toBeUndefined();
  });

  it ('should retain other fields when updating', () => {
    expect(newState.interval.key).toEqual('daily');
    expect(newState.podcastId).toEqual('70');
    newState = CustomRouterReducer(newState,
      new CustomRouterNavigationAction({routerParams: {interval: INTERVAL_HOURLY}}));
    expect(newState.interval.key).toEqual('hourly');
    expect(newState.podcastId).toEqual('70');
  });
});
