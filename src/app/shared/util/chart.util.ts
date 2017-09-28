import * as moment from 'moment';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

// metrics data is an array of arrays of [datetime string, numeric value]
export const mapMetricsToTimeseriesData = (data: any[][]): TimeseriesDatumModel[] => {
  return data.map((datum: any) => {
    return { value: datum[1], date: moment(datum[0]).valueOf() };
  });
};

export const subtractTimeseriesDatasets = (from: TimeseriesDatumModel[], datasets: TimeseriesDatumModel[][]): TimeseriesDatumModel[] => {
  return from.map((fromDatum, i) => {
    const total = datasets.map(dataset => dataset[i].value).reduce((acc, value) => acc += value);
    return {value: fromDatum.value - total, date: fromDatum.date};
  });
};

export const UTCDateFormat = (date: Date) => {
  return date.toUTCString();
};

export const dailyDateFormat =(date: Date) => {
  const dayOfWeek = (day: number): string => {
    switch (day) {
      case 0:
        return 'Sun';
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
    }
  };
  return dayOfWeek(date.getUTCDay()) + ' ' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
};

export const hourlyDateFormat = (date: Date) => {
  const minutes = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
  return (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + ' ' +
    date.getUTCHours() + ':' + minutes;
};
