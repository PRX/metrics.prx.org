import { RouterParams, Episode, Podcast, ChartType, MetricsType,
  CHARTTYPE_STACKED, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../app/ngrx';
import * as dateUtil from "../app/shared/util/date";

export const podcast: Podcast = {
  id: '70',
  title: 'Pet Talks Daily'
};

const publishedAt0 = new Date('2017-08-27T00:00:00Z');
const publishedAt1 = new Date('2017-08-20T00:00:00Z');
export const episodes: Episode[] = [
  {
    podcastId: podcast.id,
    guid: 'abcdefg',
    publishedAt: publishedAt0,
    title: 'A Pet Talk Episode',
    page: 1
  },
  {
    podcastId: podcast.id,
    guid: 'gfedcba',
    publishedAt: publishedAt1,
    title: 'Another Pet Talk Episode',
    page: 1
  }
];
export const routerParams: RouterParams = {
  podcastId: podcast.id,
  episodePage: 1,
  beginDate: dateUtil.beginningOfLast28DaysUTC().toDate(),
  endDate: dateUtil.endOfTodayUTC().toDate(),
  standardRange: dateUtil.LAST_28_DAYS,
  interval: INTERVAL_DAILY,
  chartType: <ChartType>CHARTTYPE_STACKED,
  metricsType: <MetricsType>METRICSTYPE_DOWNLOADS
};

export const podDownloads = [
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
export const podHourlyDownloads = [
  ['2017-09-07T00:00:00Z', 52522],
  ['2017-09-07T01:00:00Z', 162900],
  ['2017-09-07T02:00:00Z', 46858],
  ['2017-09-07T03:00:00Z', 52522],
  ['2017-09-07T04:00:00Z', 162900],
  ['2017-09-07T05:00:00Z', 46858],
  ['2017-09-07T06:00:00Z', 52522],
  ['2017-09-07T07:00:00Z', 162900],
  ['2017-09-07T08:00:00Z', 46858],
  ['2017-09-07T09:00:00Z', 52522],
  ['2017-09-07T10:00:00Z', 162900],
  ['2017-09-07T11:00:00Z', 46858],
  ['2017-09-07T12:00:00Z', 52522],
  ['2017-09-07T13:00:00Z', 162900],
  ['2017-09-07T14:00:00Z', 46858],
  ['2017-09-07T15:00:00Z', 52522],
  ['2017-09-07T16:00:00Z', 162900],
  ['2017-09-07T17:00:00Z', 46858],
  ['2017-09-07T18:00:00Z', 52522],
  ['2017-09-07T19:00:00Z', 162900],
  ['2017-09-07T20:00:00Z', 46858],
  ['2017-09-07T21:00:00Z', 52522],
  ['2017-09-07T22:00:00Z', 162900],
  ['2017-09-07T23:00:00Z', 46858]
];
export const ep0Downloads = [
  ['2017-08-27T00:00:00Z', 22],
  ['2017-08-28T00:00:00Z', 90],
  ['2017-08-29T00:00:00Z', 58],
  ['2017-08-30T00:00:00Z', 22],
  ['2017-08-31T00:00:00Z', 90],
  ['2017-09-01T00:00:00Z', 58],
  ['2017-09-02T00:00:00Z', 22],
  ['2017-09-03T00:00:00Z', 90],
  ['2017-09-04T00:00:00Z', 58],
  ['2017-09-05T00:00:00Z', 22],
  ['2017-09-06T00:00:00Z', 90],
  ['2017-09-07T00:00:00Z', 58]
];
export const ep1Downloads = [
  ['2017-08-27T00:00:00Z', 522],
  ['2017-08-28T00:00:00Z', 900],
  ['2017-08-29T00:00:00Z', 858],
  ['2017-08-30T00:00:00Z', 522],
  ['2017-08-31T00:00:00Z', 900],
  ['2017-09-01T00:00:00Z', 858],
  ['2017-09-02T00:00:00Z', 522],
  ['2017-09-03T00:00:00Z', 900],
  ['2017-09-04T00:00:00Z', 858],
  ['2017-09-05T00:00:00Z', 522],
  ['2017-09-06T00:00:00Z', 900],
  ['2017-09-07T00:00:00Z', 858]
];
export const podPerformance = {total: 1049120, previous7days: 5, this7days: 5, yesterday: 1, today: 1};
export const podPerformanceOff = {total: 1049119, previous7days: 5, this7days: 5, yesterday: 1, today: 1};
export const ep0Performance = {total: 680, previous7days: 0, this7days: 5, yesterday: 1, today: 1};
export const ep0PerformanceOff = {total: 679, previous7days: 0, this7days: 5, yesterday: 1, today: 1};
export const ep1Performance = {total: 9120, previous7days: 0, this7days: 5, yesterday: 1, today: 1};
export const ep1PerformanceOff = {total: 9119, previous7days: 0, this7days: 5, yesterday: 1, today: 1};
