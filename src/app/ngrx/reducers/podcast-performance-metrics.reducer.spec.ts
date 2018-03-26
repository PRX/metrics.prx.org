import * as ACTIONS from '../actions';
import { PodcastPerformanceMetricsReducer } from './podcast-performance-metrics.reducer';
import { podDownloads } from '../../../testing/downloads.fixtures';
import { getTotal } from '../../shared/util/metrics.util';

describe('PodcastPerformanceMetricsReducer', () => {
  let newState;
  beforeEach(() => {
    newState = PodcastPerformanceMetricsReducer(undefined,
      new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({
        seriesId: 37800,
        feederId: '70'
      }));
  });

  it('should be in loading state after load request', () => {
    expect(newState.entities[37800].loading).toBe(true);
  });

  it('should set podcast performance numbers on success', () => {
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[37800].loaded).toBe(true);
    expect(newState.entities[37800].total).toEqual(10);
  });

  it('should set error on failure', () => {
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastPerformanceMetricsFailureAction({
      seriesId: 37800,
      feederId: '70',
      error: 'This is an error'
    }));
    expect(newState.entities[37800].loading).toBe(false);
    expect(newState.entities[37800].loaded).toBe(false);
    expect(newState.entities[37800].error).toEqual('This is an error');
  });

  it('loading should not clear performance values', () => {
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[37800].loaded).toBe(true);
    expect(newState.entities[37800].total).toEqual(10);
    newState = PodcastPerformanceMetricsReducer(newState,
      new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({
        seriesId: 37800,
        feederId: '70'
      }));
    expect(newState.entities[37800].loaded).toBe(false);
    expect(newState.entities[37800].loading).toBe(true);
    expect(newState.entities[37800].total).toEqual(10);
  });

  it('should set total from summing metrics if larger than all time total', () => {
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      metricsPropertyName: 'dailyDownloads',
      metrics: podDownloads
    }));
    expect(newState.entities[37800].total).toEqual(getTotal(podDownloads));
  });

  it('should set total from summing metrics if podcast with seriesId not yet on state', () => {
    newState = PodcastPerformanceMetricsReducer(undefined, new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      metricsPropertyName: 'dailyDownloads',
      metrics: podDownloads
    }));
    expect(newState.entities[37800].total).toEqual(getTotal(podDownloads));
  });

  it('should keep total from summing metrics if total from performance metrics is not larger', () => {
    newState = PodcastPerformanceMetricsReducer(undefined, new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      metricsPropertyName: 'dailyDownloads',
      metrics: podDownloads
    }));
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[37800].total).toEqual(getTotal(podDownloads));
  });

  it('should not keep total from summing metrics if total from performance metrics is larger', () => {
    const total = getTotal(podDownloads);
    newState = PodcastPerformanceMetricsReducer(undefined, new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      metricsPropertyName: 'dailyDownloads',
      metrics: podDownloads
    }));
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      total: total + 1,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities[37800].total).toEqual(total + 1);
  });
});
