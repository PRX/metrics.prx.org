import { RouterParams, PodcastDownloads, EpisodeDownloads, getMetricsProperty,
  IntervalModel, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '../../ngrx';
import * as dateUtil from './date/date.util';

export const findPodcastDownloads =
  (params: RouterParams, PodcastDownloads: PodcastDownloads[]): PodcastDownloads => {
  if (params && params.podcastId && params.interval && params.beginDate && params.endDate && PodcastDownloads) {
    const metricsProperty = getMetricsProperty(params.interval, params.metricsType);
    const metrics = PodcastDownloads
      .filter((metric: PodcastDownloads) => metric.id === params.podcastId &&
        metric[metricsProperty]);
    if (metrics && metrics.length) {
      return metrics[0]; // only one entry should match the series id
    }
  }
};

export const metricsData = (params: RouterParams, metrics: PodcastDownloads | EpisodeDownloads) => {
  const metricsProperty = getMetricsProperty(params.interval, params.metricsType);
  return metrics && metrics[metricsProperty];
};

export const getTotal = (metrics: any[][]): number => {
  if (metrics && metrics.length) {
    return metrics.map(d => d[1]).reduce((acc: number, value: number) => {
      return acc + value;
    });
  } else {
    return 0;
  }
};

export const filterMetricsByDate = (metrics: any[][], beginDate: Date, endDate: Date, interval: IntervalModel): any[][] => {
  let begin, end;
  if (beginDate.valueOf() !== new Date(metrics[0][0]).valueOf()) {
    // look for metrics date label to be between begin and end of interval
    begin = metrics.findIndex(metric => {
      const metricDateLabel = new Date(metric[0]);
      return metricDateLabel.valueOf() >= dateUtil.roundDateToBeginOfInterval(beginDate, interval).valueOf() &&
        metricDateLabel.valueOf() <= dateUtil.roundDateToEndOfInterval(beginDate, interval).valueOf();
    });
  }
  if (interval === INTERVAL_HOURLY) {
    // don't include the end of current day zeroes for hourly
    const thisHour = dateUtil.beginningOfThisHourUTC();
    if (endDate.valueOf() >= thisHour.valueOf()) {
      end = metrics.length -
        metrics.slice().reverse().findIndex(metric => new Date(metric[0]).valueOf() <= thisHour.valueOf());
    }
  } else if (endDate.valueOf() !== new Date(metrics[metrics.length - 1][0]).valueOf()) {
    end = metrics.length -
      metrics.slice().reverse().findIndex(metric => new Date(metric[0]).valueOf() <= endDate.valueOf());
  }
  return metrics.slice(begin || 0, end);
};

export const getWeightedAverage = (metrics: any[][], beginDate: Date, endDate: Date, interval: IntervalModel): number => {
  const buckets = filterMetricsByDate(metrics, beginDate, endDate, interval);
  const now = new Date();

  if (buckets.length) {
    // does the first and/or last data point only cover a partial period? and what is the weight?
    let firstWeight = 1, lastWeight = 1;
    switch (interval) {
      case INTERVAL_HOURLY: {
        // first bucket will be a full hour
        firstWeight = 1;
        // last bucket depends on if it is the current hour
        const lastBucketEndTime = new Date(buckets[buckets.length - 1][0]);
        if (lastBucketEndTime.valueOf() >= dateUtil.beginningOfThisHourUTC().valueOf()) { // bucket time would be at the top of the hour
          lastWeight = new Date().getUTCMinutes() / 60;
        }
      }
        break;
      case INTERVAL_DAILY: {
        // first bucket will be a full day because there are no timepickers
        firstWeight = 1;
        // last bucket depends on if it is the current day, and if it is will mostly always be partial until the last minute
        const lastBucketEndDate = new Date(buckets[buckets.length - 1][0]);
        if (lastBucketEndDate.valueOf() >= dateUtil.beginningOfTodayUTC().valueOf()) {
          lastWeight = (now.getUTCHours() * 60 + now.getUTCMinutes()) / (24 * 60);
        }
      }
        break;
      case INTERVAL_WEEKLY: {
        // calculate just a single weight when release date is this week
        if (beginDate.valueOf() >= dateUtil.beginningOfThisWeekUTC().valueOf()) {
          if (endDate.getUTCDay() !== now.getUTCDay()) {
            // if the end date is not today, weighting by day is sufficient
            firstWeight = (endDate.getUTCDay() - beginDate.getUTCDay() + 1) / 7;
          } else {
            // if the end date is today, weight up to the minute (use now not the end date since end date is EOD)
            firstWeight = ((now.getUTCDay() - beginDate.getUTCDay()) * 24 * 60 + now.getUTCHours() * 60 + now.getUTCMinutes()) /
              (7 * 24 * 60);
          }
        } else {
          // first bucket could start mid week, but it will be a full day because there are no timepickers
          if (beginDate.getUTCDay() > 0) {
            firstWeight = (7 - beginDate.getUTCDay()) / 7;
          }
          // last bucket depends on ending in the current day or if it is not the last day of that week
          if (endDate.valueOf() >= dateUtil.beginningOfTodayUTC().valueOf()) {
            lastWeight = ((now.getUTCDay() + 1) * 24 * 60 + now.getUTCHours() * 60 + now.getUTCMinutes()) / (7 * 24 * 60);
          } else if (endDate.getUTCDay() !== 6) {
            // if it is not last day of week, it will be a full day because there are no timepickers
            lastWeight = (endDate.getUTCDay() + 1) / 7;
          }
        }
      }
        break;
      case INTERVAL_MONTHLY: {
        const daysInBeginMonth = dateUtil.getDaysInMonth(beginDate);
        // calculate just a single weight when release date is this month
        if (beginDate.valueOf() >= dateUtil.beginningOfThisMonthUTC().valueOf()) {
          if (endDate.getUTCDate() !== now.getUTCDate()) {
            // if the end date is not today, weighting by day is sufficient
            firstWeight = (endDate.getUTCDate() - beginDate.getUTCDate() + 1) / daysInBeginMonth;
          } else {
            // if the end date is today, weight up to the minute (use now not the end date since end date is EOD)
            firstWeight = ((now.getUTCDate() - beginDate.getUTCDate()) * 24 * 60 + now.getUTCHours() * 60 + now.getUTCMinutes()) /
              (daysInBeginMonth * 24 * 60);
          }
        } else {
          // first bucket could start mid month, but it will be a full day because there are no timepickers
          if (beginDate.getUTCDate() > 1) {
            firstWeight = (daysInBeginMonth - beginDate.getUTCDate() + 1) / daysInBeginMonth;
          }
          // last bucket depends on ending on the current day or if it is not the last day of that month
          const daysInEndMonth = dateUtil.getDaysInMonth(endDate);
          if (endDate.valueOf() >= dateUtil.beginningOfTodayUTC().valueOf()) {
            lastWeight = (now.getUTCDate() * 24 * 60 + now.getUTCHours() * 60 + now.getUTCMinutes()) / (daysInEndMonth * 24 * 60);
          } else if (endDate.getUTCDate() !== daysInEndMonth) {
            lastWeight = (endDate.getUTCDate() / daysInEndMonth);
          }
        }
      }
        break;
    }

    // Σwx/Σw
    // i.e. sum the weighted numbers then divide by the sum of the weights, "simple math"
    // partial buckets values are already "weighted" by being partial
    return Math.round(getTotal(buckets) / (firstWeight + buckets.length - 2 + lastWeight));
  }
};
