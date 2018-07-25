import * as ACTIONS from '../actions';
import { EpisodePerformanceMetricsReducer } from './episode-performance-metrics.reducer';

describe('EpisodePerformanceMetricsReducer', () => {
  let newState;
  beforeEach(() => {
    newState = EpisodePerformanceMetricsReducer(undefined,
      new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({
        seriesId: 37800,
        feederId: '70',
        id: 123,
        guid: 'abcdefg'
      }));
  });

  it('should be in loading state after load request', () => {
    expect(newState.entities['abcdefg'].loading).toBe(true);
  });

  it('should set episode performance numbers on success', () => {
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: 37800,
      feederId: '70',
      id: 123,
      guid: 'abcdefg',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities['abcdefg'].loaded).toBe(true);
    expect(newState.entities['abcdefg'].total).toEqual(10);
  });

  it('should set error on failure', () => {
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsFailureAction({
      seriesId: 37800,
      feederId: '70',
      id: 123,
      guid: 'abcdefg',
      error: 'This is an error'
    }));
    expect(newState.entities['abcdefg'].loading).toBe(false);
    expect(newState.entities['abcdefg'].loaded).toBe(false);
    expect(newState.entities['abcdefg'].error).toEqual('This is an error');
  });

  it('loading should not clear performance values', () => {
    newState = EpisodePerformanceMetricsReducer(newState, new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: 37800,
      id: 123,
      feederId: '70',
      guid: 'abcdefg',
      total: 10,
      previous7days: 6,
      this7days: 4,
      yesterday: 2,
      today: 1
    }));
    expect(newState.entities['abcdefg'].loaded).toBe(true);
    expect(newState.entities['abcdefg'].total).toEqual(10);
    newState = EpisodePerformanceMetricsReducer(newState,
      new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({
        seriesId: 37800,
        feederId: '70',
        id: 123,
        guid: 'abcdefg'
      }));
    expect(newState.entities['abcdefg'].loaded).toBe(false);
    expect(newState.entities['abcdefg'].loading).toBe(true);
    expect(newState.entities['abcdefg'].total).toEqual(10);
  });
});
