import { reducer, initialState } from './podcast-totals.reducer';
import * as ACTIONS from '../actions';
import {
  routerParams as downloadParams,
  podcastAgentNameRanks
} from '../../../testing/downloads.fixtures';
import { GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, podcastTotalsKey } from './models';

describe('PodcastTotals Reducer', () => {
  const routerParams = {...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME};

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should set loading, loaded, and unset error on podcast ranks load', () => {
    const { podcastId, group, filter, beginDate, endDate } = routerParams;
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastTotalsLoadAction({id: podcastId, group, beginDate, endDate}));
    const key = podcastTotalsKey(podcastId, group, filter, beginDate, endDate);
    expect(newState.entities[key].loading).toBeTruthy();
    expect(newState.entities[key].loaded).toBeFalsy();
    expect(newState.entities[key].error).toBeNull();
  });

  it('should set podcast totals entities and loaded on podcast totals success', () => {
    const { podcastId, group, filter, beginDate, endDate } = routerParams;
    const key = podcastTotalsKey(podcastId, group, filter, beginDate, endDate);
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastTotalsSuccessAction({
        id: podcastId, group, beginDate, endDate,
        ranks: podcastAgentNameRanks}));
    expect(newState.entities[key]).toEqual({
      // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
      id: key,
      key,
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
    const key = podcastTotalsKey(podcastId, group, filter, beginDate, endDate);
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastTotalsSuccessAction({
        id: podcastId, group, filter, beginDate, endDate,
        ranks: podcastAgentNameRanks}));
    expect(newState.entities[key])
      .not.toBeNull();
  });

  it('should set error on failure', () => {
    const { podcastId, group, filter, beginDate, endDate } = routerParams;
    const newState = reducer(initialState, new ACTIONS.CastlePodcastTotalsFailureAction({
      id: podcastId, group, filter, beginDate, endDate, error: 'something went wrong'}));
    expect(newState.entities[podcastTotalsKey(podcastId, group, filter, beginDate, endDate)].error).not.toBeUndefined();
  });
});
