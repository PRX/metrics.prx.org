import { reducer, initialState } from './podcast-totals.reducer';
import * as ACTIONS from '../actions';
import { routerParams as downloadParams, podcastAgentNameRanks } from '../../../testing/downloads.fixtures';
import { GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, podcastTotalsId } from './models';

describe('PodcastTotals Reducer', () => {
  const routerParams = { ...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should set loading, loaded, and unset error on podcast ranks load', () => {
    const { podcastId, group, filter, beginDate, endDate } = routerParams;
    const newState = reducer(initialState, ACTIONS.CastlePodcastTotalsLoad({ podcastId, group, beginDate, endDate }));
    const id = podcastTotalsId(podcastId, group, filter, beginDate, endDate);
    expect(newState.entities[id].loading).toBeTruthy();
    expect(newState.entities[id].loaded).toBeFalsy();
    expect(newState.entities[id].error).toBeNull();
  });

  it('should set podcast totals entities and loaded on podcast totals success', () => {
    const { podcastId, group, filter, beginDate, endDate } = routerParams;
    const id = podcastTotalsId(podcastId, group, filter, beginDate, endDate);
    const newState = reducer(
      initialState,
      ACTIONS.CastlePodcastTotalsSuccess({
        podcastId,
        group,
        beginDate,
        endDate,
        ranks: podcastAgentNameRanks
      })
    );
    expect(newState.entities[id]).toEqual({
      id,
      podcastId,
      group,
      filter,
      beginDate,
      endDate,
      ranks: podcastAgentNameRanks,
      loaded: true,
      loading: false
    });
  });

  it('should include filter in key for geo subdiv', () => {
    const { podcastId, group, filter, beginDate, endDate } = routerParams;
    const id = podcastTotalsId(podcastId, group, filter, beginDate, endDate);
    const newState = reducer(
      initialState,
      ACTIONS.CastlePodcastTotalsSuccess({
        podcastId,
        group,
        filter,
        beginDate,
        endDate,
        ranks: podcastAgentNameRanks
      })
    );
    expect(newState.entities[id]).not.toBeNull();
  });

  it('should set error on failure', () => {
    const { podcastId, group, filter, beginDate, endDate } = routerParams;
    const newState = reducer(
      initialState,
      ACTIONS.CastlePodcastTotalsFailure({
        podcastId,
        group,
        filter,
        beginDate,
        endDate,
        error: 'something went wrong'
      })
    );
    expect(newState.entities[podcastTotalsId(podcastId, group, filter, beginDate, endDate)].error).not.toBeUndefined();
  });
});
