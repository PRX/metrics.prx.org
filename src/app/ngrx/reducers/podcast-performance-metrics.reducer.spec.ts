import * as ACTIONS from '../actions';
import { PodcastPerformanceMetricsReducer } from './podcast-performance-metrics.reducer';

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
    expect(newState.entities['70'].loading).toBe(true);
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
    expect(newState.entities['70'].loaded).toBe(true);
    expect(newState.entities['70'].total).toEqual(10);
  });

  it('should set error on failure', () => {
    newState = PodcastPerformanceMetricsReducer(newState, new ACTIONS.CastlePodcastPerformanceMetricsFailureAction({
      seriesId: 37800,
      feederId: '70',
      error: 'This is an error'
    }));
    expect(newState.entities['70'].loading).toBe(false);
    expect(newState.entities['70'].loaded).toBe(false);
    expect(newState.entities['70'].error).toEqual('This is an error');
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
    expect(newState.entities['70'].loaded).toBe(true);
    expect(newState.entities['70'].total).toEqual(10);
    newState = PodcastPerformanceMetricsReducer(newState,
      new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({
        seriesId: 37800,
        feederId: '70'
      }));
    expect(newState.entities['70'].loaded).toBe(false);
    expect(newState.entities['70'].loading).toBe(true);
    expect(newState.entities['70'].total).toEqual(10);
  });
});
