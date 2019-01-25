import * as moment from 'moment';
import { TimeseriesDatumModel, CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
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
  IntervalModel,
  EpisodeRanks,
  EpisodeTotals,
  Rank,
  GroupCharted,
  TotalsTableRow
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

export const aggregateTotalDownloads = (episodeTotals: EpisodeTotals[]) => {
  return episodeTotals && episodeTotals.reduce((accTotal, et: EpisodeTotals) => {
    if (et.ranks) {
      accTotal += et.ranks.reduce((acc, rank: Rank) => acc += rank.total, 0);
    }
    return accTotal;
  }, 0);
};

export const aggregateTotalsAccumulator =
(episodeTotals: EpisodeTotals[] | EpisodeRanks[]): {[code: string]: {code: string, label: string, value: number}} => {
  const accumulator = {};
  if (episodeTotals && episodeTotals.length && episodeTotals[0].ranks) {
    episodeTotals[0].ranks.forEach((rank: Rank) => {
      const code = String(rank.code);
      accumulator[code] = {
        code,
        label: rank.label,
        value: rank.total,
      };
    });

    if (episodeTotals && episodeTotals.length > 1) {
      episodeTotals.slice(1).reduce((acc, et: EpisodeTotals) => {
        if (et.ranks) {
          et.ranks.forEach((rank: Rank) => {
            const code = String(rank.code);
            if (acc[code]) {
              acc[code].value += rank.total;
            } else {
              acc[code] = {
                code,
                label: rank.label,
                value: rank.total,
              };
            }
          });
        }
        return acc;
      }, accumulator);
    }
  }
  return accumulator;
};

export const aggregateTotalsTable =
(episodeTotals: EpisodeTotals[], totalDownloads?: number, groupsCharted?: GroupCharted[]): TotalsTableRow[] => {
  const accumulator = aggregateTotalsAccumulator(episodeTotals);
  const rows = Object.keys(accumulator).map(code => {
      return {
        color: '',
        code,
        label: accumulator[code].label,
        value: accumulator[code].value,
        percent: totalDownloads ? accumulator[code].value * 100 / totalDownloads : null,
        charted: !groupsCharted ||
          groupsCharted.filter(group => group.charted).map(group => group.groupName).indexOf(accumulator[code].label) > -1
      };
    }).sort((a, b) => {
      return b.value - a.value;
    }).map((r, i) => {
      r.color = getColor(i);
      return r;
    });
  return rows;
};

export const aggregateTotalsBarChart = (episodeRanks: EpisodeRanks[], groupsCharted: GroupCharted[]): CategoryChartModel[] => {
  const accumulator = aggregateTotalsAccumulator(episodeRanks);
  const rows = Object.keys(accumulator).filter(code => {
      return groupsCharted.filter(group => group.charted).map(group => group.groupName).indexOf(accumulator[code].label) > -1;
    }).map(code => {
      return {
        label: accumulator[code].label,
        value: accumulator[code].value
      };
    }).sort((a, b) => {
      return b.value - a.value;
    });
  return rows;
};

export const aggregateTotalsRanks = (episodeTotals: EpisodeTotals[]): Rank[] => {
  const accumulator = aggregateTotalsAccumulator(episodeTotals);
  const ranks = Object.keys(accumulator).map(code => {
    return {
      code,
      label: accumulator[code].label,
      total: accumulator[code].value
    };
  });
  return ranks;
};

export const aggregateIntervals =
(episodeRanks: EpisodeRanks[], groupsCharted?: GroupCharted[]): TimeseriesChartModel[] => {
  if (episodeRanks && episodeRanks.length && episodeRanks[0].downloads) {
    const accumulator = {};
    episodeRanks[0].ranks.forEach((rank: Rank, i) => {
      const code = String(rank.code);
      accumulator[code] = {
        code,
        label: rank.label,
        data: episodeRanks[0].downloads.map(data => [data[0], data[1][i]])
      };
    });

    if (episodeRanks && episodeRanks.length > 1) {
      episodeRanks.slice(1).reduce((acc, epRanks: EpisodeRanks) => {
        if (epRanks.ranks) {
          epRanks.ranks.forEach((rank: Rank, i) => {
            const code = String(rank.code);
            if (acc[code]) {
              acc[code].data = acc[code].data.map((datum, j) => {
                datum[1] += epRanks.downloads[j][1][i];
                return datum;
              });
            } else {
              acc[code] = {
                code,
                label: rank.label,
                data: epRanks.downloads.map(data => [data[0], data[1][i]])
              };
            }
          });
        }
        return acc;
      }, accumulator);
    }

    const rows = Object.keys(accumulator).map(code => {
      return {
        color: '',
        code,
        label: accumulator[code].label,
        data: mapMetricsToTimeseriesData(accumulator[code].data)
      };
    }).sort((a, b) => {
      return getTotal(b.data) - getTotal(a.data);
    }).map((r, i) => {
      r.color = getColor(i);
      return r;
    }).filter(r => !groupsCharted || groupsCharted.filter(group => group.charted).map(group => group.groupName).indexOf(r.label) > -1);
    return rows;
  }
};

declare const google: any;
export const toGoogleDataTable = (ranks: Rank[], heading: string) => {
  const data = new google.visualization.DataTable();
  data.addColumn('string', heading);
  data.addColumn('number', 'Downloads');
  data.addRows(ranks.map(d => [{v: d.code, f: d.label}, d.total]));
  return data;
};
