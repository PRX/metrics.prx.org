import * as chartUtil from './chart.util';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';
import { EpisodeTotals, episodeTotalsId, EpisodeRanks, episodeRanksId, GroupType, GROUPTYPE_AGENTNAME } from '../../ngrx/reducers/models';
import { routerParams, episodes,
  ep0AgentNameRanks, ep1AgentNameRanks, ep0AgentNameDownloads, ep1AgentNameDownloads } from '../../../testing/downloads.fixtures';

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

  describe('aggregated data', () => {
    const { filter, interval, beginDate, endDate } = routerParams,
      group = GROUPTYPE_AGENTNAME;
    const episodeTotals: EpisodeTotals[] = [
      {
        id: episodeTotalsId(episodes[0].guid, group, filter, beginDate, endDate),
        guid: episodes[0].guid,
        group,
        filter,
        beginDate,
        endDate,
        ranks: ep0AgentNameRanks,
        loaded: true,
        loading: false,
        error: null
      },
      {
        id: episodeTotalsId(episodes[1].guid, group, filter, beginDate, endDate),
        guid: episodes[1].guid,
        group,
        filter,
        beginDate,
        endDate,
        ranks: ep1AgentNameRanks,
        loaded: true,
        loading: false,
        error: null
      }
    ];
    const episodeRanks: EpisodeRanks[] = [
      {
        id: episodeRanksId(episodes[0].guid, group, filter, interval, beginDate, endDate),
        guid: episodes[0].guid,
        group,
        filter,
        interval,
        beginDate,
        endDate,
        ranks: ep0AgentNameRanks,
        downloads: ep0AgentNameDownloads,
        loaded: true,
        loading: false,
        error: null
      },
      {
        id: episodeRanksId(episodes[1].guid, group, filter, interval, beginDate, endDate),
        guid: episodes[1].guid,
        group,
        filter,
        interval,
        beginDate,
        endDate,
        ranks: ep1AgentNameRanks,
        downloads: ep1AgentNameDownloads,
        loaded: true,
        loading: false,
        error: null
      }
    ];

    it('should aggregate episode total downlaods', () => {
      const getOneTotal = (et): number => {
        return et.reduce((acc, row) => acc + row.total, 0);
      };
      const ep0TotalDownloads = getOneTotal(ep0AgentNameRanks);
      const ep1TotalDownloads = getOneTotal(ep1AgentNameRanks);

      expect(chartUtil.aggregateTotalDownloads(episodeTotals)).toEqual(ep0TotalDownloads + ep1TotalDownloads);
    });

    it('should accumulate total downloads by group', () => {
      const expected = ep0AgentNameRanks.map((row, i) => row.total + ep1AgentNameRanks[i].total);
      const accumulator = chartUtil.aggregateTotalsAccumulator(episodeTotals);
      expected.forEach((total, i) =>
        expect(accumulator[ep0AgentNameRanks[i].code].value).toEqual(total)
      );
    });

    it('should sort aggregated total downloads by total values', () => {
      const results = chartUtil.aggregateTotalsTable(episodeTotals);
      expect(results[0].value).toBeGreaterThanOrEqual(results[1].value);
    });

    it('should filter bar chart totals by charted status', () => {
      const results = chartUtil.aggregateTotalsBarChart(episodeRanks, [
        {
          key: `${GROUPTYPE_AGENTNAME}-Apple Podcasts`,
          group: GROUPTYPE_AGENTNAME,
          groupName: 'Apple Podcasts',
          charted: false
        }
      ]);
      expect(results.length).toEqual(ep0AgentNameRanks.length - 1);
    });

    it('should assume groups are charted implicity', () => {
      expect(chartUtil.isGroupCharted(undefined, 'Unknown')).toBeTruthy();
      expect(chartUtil.isGroupCharted([], 'Unknown')).toBeTruthy();
      expect(chartUtil.isGroupCharted([{id: 'agentname-Unknown', group: <GroupType>'agentname', groupName: 'Unknown', charted: false}],
        'Unknown')).toBeFalsy();
      let results = chartUtil.aggregateTotalsBarChart(episodeRanks);
      expect(results.length).toEqual(ep0AgentNameRanks.length);
      results = chartUtil.aggregateTotalsBarChart(episodeRanks, []);
      expect(results.length).toEqual(ep0AgentNameRanks.length);
    });

    it('should aggregate totals ranks', () => {
      const results = chartUtil.aggregateTotalsRanks(episodeTotals);
      expect(results.find(r => r.label === 'Apple Podcasts').total).toEqual(ep0AgentNameRanks[0].total + ep1AgentNameRanks[0].total);
    });

    it('should aggregate interval data', () => {
      const results = chartUtil.aggregateIntervals(episodeRanks);
      const ep0Value = Number(ep0AgentNameDownloads[0][1][0]);
      const ep1Value = Number(ep1AgentNameDownloads[0][1][0]);
      expect(results[0].data[0].value).toEqual(ep0Value + ep1Value);
    });
  });

});
