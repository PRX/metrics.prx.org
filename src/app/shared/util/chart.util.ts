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

const LINE_COLORS = [
  '#ff7f00', '#1f78b4', '#33a02c', '#e31a1c', '#6a3d9a',
  '#fdbf6f', '#a6cee3', '#b2df8a', '#fb9a99', '#cab2d6',
];
export const getColor = (total, index) => {
  return LINE_COLORS[index % LINE_COLORS.length];
};
export const getShade = (total, index) => {
  return generateShades(total)[index % total];
};
