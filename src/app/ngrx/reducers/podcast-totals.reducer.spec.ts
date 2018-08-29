import { reducer, initialState } from './podcast-totals.reducer';
import * as ACTIONS from '../actions';
import {
  routerParams as downloadParams,
  podcastAgentNameRanks
} from '../../../testing/downloads.fixtures';
import { GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES } from './models';

describe('PodcastTotals Reducer', () => {
  const routerParams = {...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME};

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should set loading, loaded, and unset error on podcast ranks load', () => {
    const { group, beginDate, endDate } = routerParams;
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastTotalsLoadAction({id: routerParams.podcastId, group, beginDate, endDate}));
    expect(newState.loading).toBeTruthy();
    expect(newState.loaded).toBeFalsy();
    expect(newState.error).toBeNull();
  });

  it('should set podcast totals entities and loaded on podcast totals success', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastTotalsSuccessAction({
        id: routerParams.podcastId, group: routerParams.group,
        ranks: podcastAgentNameRanks}));
    expect(newState.entities[`${routerParams.podcastId}-${routerParams.group}`]).toEqual({
      // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
      id: `${routerParams.podcastId}-${routerParams.group}`,
      key: `${routerParams.podcastId}-${routerParams.group}`,
      podcastId: routerParams.podcastId,
      group: routerParams.group,
      ranks: podcastAgentNameRanks
    });
    expect(newState.loaded).toBeTruthy();
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState, new ACTIONS.CastlePodcastTotalsFailureAction({
      id: routerParams.podcastId, group: GROUPTYPE_AGENTNAME, error: 'something went wrong'}));
    expect(newState.error).not.toBeUndefined();
  });
});
