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

const LINE_COLORS = ['#396ab1', '#da7c30', '#3e9651', '#cc2529', '#535154',
  '#6b4c9a', '#922428', '#948b3d'];
export const getColor = (total, index) => {
  console.log(LINE_COLORS[index % LINE_COLORS.length]);
  return LINE_COLORS[index % LINE_COLORS.length];
};
export const getShade = (total, index) => {
  console.log(generateShades(total)[index % total]);
  return generateShades(total)[index % total];
};
