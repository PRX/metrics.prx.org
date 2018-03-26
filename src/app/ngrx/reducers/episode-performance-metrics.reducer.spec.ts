import * as ACTIONS from '../actions';
import { EpisodePerformanceMetricsReducer } from './episode-performance-metrics.reducer';
import { ep0Downloads, ep1Downloads } from '../../../testing/downloads.fixtures';
import { getTotal } from '../../shared/util/metrics.util';

describe('EpisodePerformanceMetricsReducer', () => {
  let newState;
  beforeEach(() => {
    newState = EpisodePerformanceMetricsReducer(undefined,
      new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({
        seriesId: 37800,
        id: 123,
        guid: 'abcdefg'
      }));
  });

  it('should be in loading state after load request', () => {
    expect(newState.entities[123].loading).toBe(true);
  });

  it('should set episode performance numbers on success', () => {
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'gfedcba',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[123].loaded).toBe(true);
    expect(newState.entities[123].total).toEqual(10);
  });

  it('should set error on failure', () => {
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsFailureAction({
      seriesId: 37800,
      id: 123,
      guid: 'gfedcba',
      error: 'This is an error'
    }));
    expect(newState.entities[123].loading).toBe(false);
    expect(newState.entities[123].loaded).toBe(false);
    expect(newState.entities[123].error).toEqual('This is an error');
  });

  it('loading should not clear performance values', () => {
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'gfedcba',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[123].loaded).toBe(true);
    expect(newState.entities[123].total).toEqual(10);
    newState = EpisodePerformanceMetricsReducer(newState,
      new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({
        seriesId: 37800,
        id: 123,
        guid: 'abcdefg'
      }));
    expect(newState.entities[123].loaded).toBe(false);
    expect(newState.entities[123].loading).toBe(true);
    expect(newState.entities[123].total).toEqual(10);
  });

  it('should set total from summing metrics if larger than all time total', () => {
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      total: 5,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      page: 1,
      metricsPropertyName: 'dailyDownloads',
      metrics: ep0Downloads
    }));
    expect(newState.entities[123].total).toEqual(getTotal(ep0Downloads));
  });

  it('should set total from summing metrics if podcast with seriesId not yet on state', () => {
    newState = EpisodePerformanceMetricsReducer(undefined, new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      page: 1,
      metricsPropertyName: 'dailyDownloads',
      metrics: ep0Downloads
    }));
    expect(newState.entities[123].total).toEqual(getTotal(ep0Downloads));
  });

  it('should keep total from summing metrics if total from performance metrics is not larger', () => {
    newState = EpisodePerformanceMetricsReducer(undefined, new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      page: 1,
      metricsPropertyName: 'dailyDownloads',
      metrics: ep0Downloads
    }));
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[123].total).toEqual(getTotal(ep0Downloads));
  });

  it('should not keep total from summing metrics if total from performance metrics is larger', () => {
    const total = getTotal(ep0Downloads);
    newState = EpisodePerformanceMetricsReducer(undefined, new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      page: 1,
      metricsPropertyName: 'dailyDownloads',
      metrics: ep0Downloads
    }));
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      total: total + 1,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[123].total).toEqual(total + 1);
  });
});
