import { reducer, initialState } from './podcast-totals.reducer';
import * as ACTIONS from '../actions';
import {
  routerParams as downloadParams,
  podcastAgentNameRanks, podcastAgentNameDownloads
} from '../../../testing/downloads.fixtures';
import {GROUPTYPE_AGENTNAME, GROUPTYPE_GEOSUBDIV, METRICSTYPE_TRAFFICSOURCES} from './models';

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
    const { podcastId, group, beginDate, endDate } = routerParams;
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastTotalsLoadAction({id: podcastId, group, beginDate, endDate}));
    expect(newState.entities[`${podcastId}-${group}`].loading).toBeTruthy();
    expect(newState.entities[`${podcastId}-${group}`].loaded).toBeFalsy();
    expect(newState.entities[`${podcastId}-${group}`].error).toBeNull();
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
      filter: undefined,
      ranks: podcastAgentNameRanks,
      loaded: true,
      loading: false
    });
  });

  it('should include filter in key for geo subdiv', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastTotalsSuccessAction({
        id: routerParams.podcastId, group: GROUPTYPE_GEOSUBDIV,
        ranks: podcastAgentNameRanks}));
    expect(newState.entities[`${routerParams.podcastId}-${GROUPTYPE_GEOSUBDIV}-${routerParams.filter}`])
      .not.toBeNull();
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState, new ACTIONS.CastlePodcastTotalsFailureAction({
      id: routerParams.podcastId, group: GROUPTYPE_AGENTNAME, error: 'something went wrong'}));
    expect(newState.entities[`${routerParams.podcastId}-${routerParams.group}`].error).not.toBeUndefined();
  });
});
