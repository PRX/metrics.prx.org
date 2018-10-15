import * as moment from 'moment';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';
import * as tinycolor2 from 'tinycolor2';
import {
  CHARTTYPE_EPISODES,
  CHARTTYPE_HORIZBAR,
  CHARTTYPE_LINE,
  CHARTTYPE_PODCAST,
  CHARTTYPE_STACKED,
  ChartType,
  INTERVAL_DAILY,
  INTERVAL_HOURLY,
  INTERVAL_MONTHLY,
  INTERVAL_WEEKLY,
  IntervalModel
} from '../../ngrx';
import * as dateFormat from './date/date.format';

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

export const getTotal = (data: TimeseriesDatumModel[]): number => {
  if (data && data.length) {
    return data.map(d => d.value).reduce((acc: number, value: number) => {
      return acc + value;
    });
  } else {
    return 0;
  }
};

export const baseColor = 'rgb(32, 80, 96)';
export const neutralColor = '#a3a3a3';
export const standardColor = '#0089bd';

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

const LINE_COLORS = [
  '#ff7f00', '#1f78b4', '#33a02c', '#e31a1c', '#6a3d9a',
  '#fdbf6f', '#a6cee3', '#b2df8a', '#fb9a99', '#cab2d6',
];
export const getColor = (index) => {
  return LINE_COLORS[index % LINE_COLORS.length];
};
export const getShade = (total, index) => {
  return generateShades(total)[index % total];
};

export const chartDateFormat = (interval: IntervalModel): Function => {
  switch (interval) {
    case INTERVAL_MONTHLY:
      return dateFormat.monthDateYear;
    case INTERVAL_WEEKLY:
    case INTERVAL_DAILY:
      return dateFormat.monthDate;
    case INTERVAL_HOURLY:
      return dateFormat.hourly;
    default:
      return dateFormat.UTCString;
  }
};

export const c3ChartType = (chartType: ChartType): string => {
  switch (chartType) {
    case CHARTTYPE_PODCAST:
    case CHARTTYPE_HORIZBAR:
      return 'bar';
    case CHARTTYPE_EPISODES:
    case CHARTTYPE_LINE:
      return 'line';
    case CHARTTYPE_STACKED:
      return 'area';
  }
};

export const isStacked = (chartType: ChartType): boolean => {
  return chartType === CHARTTYPE_STACKED;
};

export const showPoints = (chartType: ChartType): boolean => {
  switch (chartType) {
    case CHARTTYPE_EPISODES:
    case CHARTTYPE_LINE:
      return true;
    case CHARTTYPE_STACKED:
      return false;
  }
};

export const strokeWidth = (chartType: ChartType): number => {
  switch (chartType) {
    case CHARTTYPE_EPISODES:
    case CHARTTYPE_LINE:
      return 2.5;
    case CHARTTYPE_STACKED:
      return 1;
  }
};

export const pointRadius = (chartType: ChartType, dataLength): number => {
  switch (chartType) {
    case CHARTTYPE_EPISODES:
    case CHARTTYPE_LINE:
      return dataLength <= 20 ? 3.25 : 0;
    case CHARTTYPE_STACKED:
      return 1;
  }
};

export const pointRadiusOnHover = (chartType: ChartType): number => {
  switch (chartType) {
    case CHARTTYPE_LINE:
    case CHARTTYPE_EPISODES:
      return 3.25;
    case CHARTTYPE_STACKED:
      return 1;
  }
};

export const minY = (chartType: ChartType): number => {
  if (chartType === CHARTTYPE_EPISODES || chartType === CHARTTYPE_LINE) {
    return 0;
  }
};
