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
