import * as moment from 'moment';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';
import * as tinycolor2 from 'tinycolor2';

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

export const UTCDateFormat = (date: Date): string => {
  return date.toUTCString();
};

export const dailyDateFormat = (date: Date): string => {
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

export const dayMonthDate = (date: Date): string => {
  return date.getUTCMonth() + 1 + '/' + date.getUTCDate();
};

export const hourlyDateFormat = (date: Date): string => {
  const minutes = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
  return (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + ' ' +
    date.getUTCHours() + ':' + minutes;
};

export const baseColor = 'rgb(32, 80, 96)';
export const neutralColor = '#a3a3a3';

export const lightenColor = (color: string, percent: number) => {
  return tinycolor2(color).lighten(percent);
};

export const generateShades = (length) => {
  const shades = [];
  for (let i = 0; i < length; i++) {
    // to lighten the color almost up to 75%
    const percent = i > 0 ? 75 * i / length : 0;
    shades.push(lightenColor(baseColor, percent));
  }
  return shades;
};
