import * as ACTIONS from '../actions';
import { EpisodePerformanceMetricsReducer } from './episode-performance-metrics.reducer';

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
});
