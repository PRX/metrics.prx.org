import { RouterParams, ChartType, MetricsType,
  INTERVAL_HOURLY, INTERVAL_DAILY, CHARTTYPE_PODCAST, CHARTTYPE_STACKED, METRICSTYPE_DOWNLOADS } from '../';
import { CustomSerializer } from './router.serializer';
import * as dateUtil from '../../shared/util/date';

describe('CustomSerializer', () => {
  const serializer = new CustomSerializer();

  it('should transform router snapshot to router state', () => {
    const routerSnapshot = {
      url: '/37800/70/reach/stacked/hourly;' +
      'episodePage=1;beginDate=2017-11-09T00:00:00.000Z;endDate=2017-11-09T22:00:00.000Z;' +
      'episodes=123,1234,chartPodcast=true',
      root: {
        firstChild: {
          params: {
            seriesId: '37800',
            podcastId: '70',
            chartType: CHARTTYPE_STACKED,
            interval: INTERVAL_HOURLY.key,
            page: '1',
            beginDate: '2017-11-09T00:00:00.000Z',
            endDate: '2017-11-09T23:59:59.999Z',
            episodes: '123,1234',
            chartPodcast: 'true'
          }
        }
      }
    };
    const routerParams: RouterParams = {
      podcastId: '70',
      podcastSeriesId: 37800,
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      chartType: <ChartType>CHARTTYPE_STACKED,
      interval: INTERVAL_HOURLY,
      episodePage: 1,
      beginDate: new Date('2017-11-09T00:00:00.000Z'),
      endDate: new Date('2017-11-09T23:59:59.999Z'),
      standardRange: dateUtil.OTHER,
      episodeIds: [123, 1234],
      chartPodcast: true
    };

    const result = serializer.serialize(routerSnapshot);
    expect(result).toEqual(routerParams);
  });

  it('should provide routerParams for begin and end date corresponding to standard range when dates not present', () => {
    const routerSnapshot = {
      url: '/37800/70/reach/podcast/daily;' +
      'episodePage=1;standardRange=3%20months;',
      root: {
        firstChild: {
          params: {
            seriesId: '37800',
            podcastId: '70',
            chartType: CHARTTYPE_PODCAST,
            interval: INTERVAL_DAILY.key,
            page: '1',
            standardRange: dateUtil.THIS_MONTH_PLUS_2_MONTHS
          }
        }
      }
    };
    const routerParams: RouterParams = {
      podcastId: '70',
      podcastSeriesId: 37800,
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      chartType: <ChartType>CHARTTYPE_PODCAST,
      interval: INTERVAL_DAILY,
      episodePage: 1,
      beginDate: dateUtil.beginningOfThisMonthPlusTwoMonthsUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate(),
      standardRange: dateUtil.THIS_MONTH_PLUS_2_MONTHS
    };

    const result = serializer.serialize(routerSnapshot);
    expect(result).toEqual(routerParams);
  });
});
