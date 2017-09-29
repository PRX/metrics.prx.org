import * as chartUtil from './chart.util';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

describe('chart.util', () => {
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
  const timeseries: TimeseriesDatumModel[] = chartUtil.mapMetricsToTimeseriesData(metrics);

  it('should map metrics to timeseries data', () => {
    expect(timeseries[0].date.valueOf()).toEqual(new Date('2017-08-27T00:00:00Z').valueOf());
    expect(timeseries[0].value).toEqual(52522);
  });

  it('should subtract a set of timeseries datasets from another timeseries dataset of the same length', () => {
    const datasets = [[...timeseries], [...timeseries]];
    const subtracted = chartUtil.subtractTimeseriesDatasets(timeseries, datasets);
    // if we subtract two of the timeseries datasets from each other, should have negative values
    expect(subtracted[0].value).toEqual(timeseries[0].value * -1);
  });

  it('should format dates in UTC', () => {
    const date = new Date();
    let utcString = chartUtil.UTCDateFormat(date);
    const search = utcString.match(/..:..:../);
    expect(parseInt(utcString.slice(search.index, search.index + 2), 10)).toEqual(date.getUTCHours());
    utcString = chartUtil.dailyDateFormat(date);
    expect(parseInt(utcString.slice(utcString.indexOf('/') + 1), 10)).toEqual(date.getUTCDate());
    utcString = chartUtil.hourlyDateFormat(date);
    expect(parseInt(utcString.slice(utcString.indexOf(':') + 1), 10)).toEqual(date.getUTCMinutes());
  });
});
