import * as moment from 'moment';
import { PodcastModel, EpisodeModel, RouterParams, PodcastMetricsModel, EpisodeMetricsModel,
  INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY, MetricsType, METRICSTYPE_DOWNLOADS } from '../../ngrx';
import * as dateUtil from './date/date.util';
import { findPodcastMetrics, metricsData, getTotal, getWeightedAverage } from './metrics.util';

describe('metrics util', () => {
  const podcasts: PodcastModel[] = [
    {
      seriesId: 37800,
      title: 'Pet Talks Daily',
      feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
      feederId: '70'
    },
    {
      seriesId: 37801,
      title: 'Totally Not Pet Talks Daily',
      feederUrl: 'https://feeder.prx.org/api/v1/podcasts/12',
      feederId: '12'
    }
  ];
  const episodes: EpisodeModel[] = [
    {
      seriesId: 37800,
      id: 123,
      publishedAt: new Date(),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    },
    {
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'Another Pet Talk Episode',
      guid: 'gfedcba'
    },
    {
      seriesId: 37801,
      id: 125,
      publishedAt: new Date(),
      title: 'Totally Not a Pet Talk Episode',
      guid: 'hijklmn'
    }
  ];
  const routerParams: RouterParams = {
    podcastSeriesId: podcasts[0].seriesId,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    episodePage: 1,
    beginDate: new Date('2017-09-01T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };
  const metrics = [
    ['2017-08-27T00:00:00Z', 52522],
    ['2017-08-28T00:00:00Z', 162900],
    ['2017-08-29T00:00:00Z', 46858],
    ['2017-08-30T00:00:00Z', 52522],
    ['2017-08-31T00:00:00Z', 162900],
    ['2017-09-01T00:00:00Z', 46858],
    ['2017-09-02T00:00:00Z', 52522],
    ['2017-09-03T00:00:00Z', 162900],
    ['2017-09-04T00:00:00Z', 46858],
    ['2017-09-05T00:00:00Z', 52522],
    ['2017-09-06T00:00:00Z', 162900],
    ['2017-09-07T00:00:00Z', 46858]
  ];
  const podcastMetrics: PodcastMetricsModel[] = [
    {
      seriesId: 37800,
      feederId: '70',
      dailyReach: [...metrics]
    },
    {
      seriesId: 37801,
      feederId: '70',
      dailyReach: [...metrics]
    }
  ];
  const episodeMetrics: EpisodeMetricsModel[] = [
    {
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      page: 1,
      dailyReach: [...metrics]
    },
    {
      seriesId: 37800,
      id: 124,
      guid: 'gfedcba',
      page: 2,
      dailyReach: [...metrics]
    },
    {
      seriesId: 37801,
      id: 125,
      guid: 'hijklmn',
      page: 1,
      dailyReach: [...metrics]
    }
  ];

  it('should find podcast metrics matching routerParams', () => {
    expect(findPodcastMetrics(routerParams, podcastMetrics).seriesId).toEqual(37800);
  });

  it('should get metrics array according to interval and metrics type', () => {
    expect(metricsData(routerParams, podcastMetrics[0]).length).toEqual(12);
    // no hourly
    expect(metricsData({interval: INTERVAL_HOURLY, metricsType: <MetricsType>METRICSTYPE_DOWNLOADS}, episodeMetrics[0])).toBeUndefined();
  });

  it('should get total of metrics datapoints', () => {
    expect(getTotal(metrics)).toEqual(52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858);
  });

  describe('Weighted Average', () => {
    const today = dateUtil.beginningOfTodayUTC();
    let now = moment().utc();
    const thisWeek = dateUtil.beginningOfThisWeekUTC();
    const thisMonth = dateUtil.beginningOfThisMonthUTC();
    const hourlyRouterParams = {
      beginDate: today.toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate(),
      interval: INTERVAL_HOURLY
    };
    const hourlyMetrics = new Array(24).fill(0).map((e, i) => {
      if (i <= now.hours()) {
        return [moment(today).utc().add(i, 'hours').format(), i + 100];
      } else {
        return [moment(today).utc().add(i, 'hours').format(), 0];
      }
    });
    const pastDailyMetrics = metrics;
    const currentDailyMetrics = [
      [moment(today).subtract(2, 'days').format(), 52522],
      [moment(today).subtract(1, 'days').format(), 162900],
      [today.format(), 46858]
    ];
    const pastWeeklyMetrics = [
      ['2018-01-11T00:00:00Z', 2019559], // 3 days in this week
      ['2018-01-14T00:00:00Z', 4367270],
      ['2018-01-21T00:00:00Z', 4148881],
      ['2018-01-28T00:00:00Z', 3907768] // metrics data is on the beginning of the week boundary, routerParams has actual end date
    ];
    const currentWeeklyMetrics = [
      [moment(thisWeek).utc().subtract(3, 'weeks').format(), 4367270],
      [moment(thisWeek).utc().subtract(2, 'weeks').format(), 4367270],
      [moment(thisWeek).utc().subtract(1, 'weeks').format(), 4148881],
      [thisWeek.format(), 3907768]
    ];
    const pastMonthlyMetrics = [
      ['2017-10-10T00:00:00Z', 12372347],
      ['2017-11-01T00:00:00Z', 18457659],
      ['2017-12-01T00:00:00Z', 16791820],
      ['2018-01-01T00:00:00Z', 13050294]
    ];
    const currentMonthlyMetrics = [
      [moment(thisMonth).subtract(3, 'months').format(), 18457659],
      [moment(thisMonth).subtract(2, 'months').format(), 16791820],
      [moment(thisMonth).subtract(1, 'months').format(), 19619978],
      [thisMonth.format(), 5248526]
    ];

    it('should be the same as plain average when there are no partial buckets', () => {
      const weightedAverage = getWeightedAverage(pastDailyMetrics,
        new Date(pastDailyMetrics[0][0].toString()),
        new Date(pastDailyMetrics[metrics.length - 1][0].toString()),
        INTERVAL_DAILY
      );
      expect(weightedAverage).toEqual(Math.round(getTotal(pastDailyMetrics) / pastDailyMetrics.length));
    });

    it('for current hourly data should not include zeroes past current hour', () => {
      const withoutZeroes = hourlyMetrics.filter(m => m[1] > 0);
      expect(getWeightedAverage(hourlyMetrics,
        hourlyRouterParams.beginDate,
        hourlyRouterParams.endDate,
        hourlyRouterParams.interval)).toEqual(getWeightedAverage(withoutZeroes,
        hourlyRouterParams.beginDate,
        hourlyRouterParams.endDate,
        hourlyRouterParams.interval));
    });

    it('for current hourly data should weight end bucket to how many minutes have passed in the current hour', () => {
      now = moment().utc();
      const manualCalc = getTotal(hourlyMetrics) / (now.hours() + (now.minutes() / 60));
      expect(getWeightedAverage(hourlyMetrics,
        hourlyRouterParams.beginDate,
        hourlyRouterParams.endDate,
        hourlyRouterParams.interval)).toEqual(Math.round(manualCalc));
    });

    it('for current daily data should weight end bucket to how many minutes have passed in the current day', () => {
      now = moment().utc();
      const weightedAverage = getWeightedAverage(currentDailyMetrics,
        new Date(currentDailyMetrics[0][0].toString()),
        today.toDate(),
        INTERVAL_DAILY
      );
      const manualCalc = getTotal(currentDailyMetrics) /
        ((currentDailyMetrics.length - 1) + (now.hours() * 60 + now.minutes()) / (24 * 60));
      expect(weightedAverage).toEqual(Math.round(manualCalc));
    });

    it('for weekly data in the past should weight begin and end buckets to how many days are included in the week', () => {
      const weightedAverage = getWeightedAverage(pastWeeklyMetrics,
        new Date(pastWeeklyMetrics[0][0].toString()),
        new Date('2018-02-02T23:59:59Z'), // 6 days in this week
        INTERVAL_WEEKLY
      );
      const manualCalc = getTotal(pastWeeklyMetrics) / ((3 / 7) + pastWeeklyMetrics.length - 2 + (6 / 7));
      expect(weightedAverage).toEqual(Math.round(manualCalc));
    });

    it('for current weekly data should weight end buckets to how much time (up to the minute) in the week has passed', () => {
      now = moment().utc();
      const weightedAverage = getWeightedAverage(currentWeeklyMetrics,
        new Date(currentWeeklyMetrics[0][0].toString()),
        dateUtil.endOfTodayUTC().toDate(),
        INTERVAL_WEEKLY
      );
      const manualCalc = getTotal(currentWeeklyMetrics) /
        (currentWeeklyMetrics.length - 1 + ((now.day() + 1) * 24 * 60 + now.hours() * 60 + now.minutes()) / (7 * 24 * 60));
      expect(weightedAverage).toEqual(Math.round(manualCalc));
    });

    it('for monthly data in the past should weight begin and end buckets to how many days are included in the month', () => {
      const weightedAverage = getWeightedAverage(pastMonthlyMetrics,
        new Date(pastMonthlyMetrics[0][0].toString()),
        new Date('2018-01-20T23:59:59Z'),
        INTERVAL_MONTHLY
      );
      const manualCalc = getTotal(pastMonthlyMetrics) / ((pastMonthlyMetrics.length - 2) + (21 / 31) + (21 / 31));
      expect(weightedAverage).toEqual(Math.round(manualCalc));
    });

    it('for current monthly data should weight end buckets to how much time (up to the minute) in the month has passed', () => {
      now = moment().utc();
      const weightedAverage = getWeightedAverage(currentMonthlyMetrics,
        new Date(currentMonthlyMetrics[0][0].toString()),
        today.toDate(),
        INTERVAL_MONTHLY
      );
      const manualCalc = getTotal(currentMonthlyMetrics) /
        (currentMonthlyMetrics.length - 1 +
        (((now.date()) * 24 * 60 + now.hours() * 60 + now.minutes()) / (dateUtil.getDaysInMonth(now.toDate()) * 24 * 60)));
      expect(weightedAverage).toEqual(Math.round(manualCalc));
    });
  });
});
