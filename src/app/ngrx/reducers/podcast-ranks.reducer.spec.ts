import { reducer, initialState } from './podcast-ranks.reducer';
import * as ACTIONS from '../actions';
import {
  routerParams as downloadParams,
  podcastAgentNameRanks,
  podcastAgentNameDownloads
} from '../../../testing/downloads.fixtures';
import { GROUPTYPE_AGENTNAME, GROUPTYPE_GEOSUBDIV, METRICSTYPE_TRAFFICSOURCES } from './models';

describe('Podcast Ranks Reducer', () => {
  const routerParams = {...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME};

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should set loading, loaded, and unset error on podcast ranks load', () => {
    const { podcastId, group, interval, beginDate, endDate } = routerParams;
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastRanksLoadAction({id: podcastId, group, interval, beginDate, endDate}));
    expect(newState.entities[`${podcastId}-${group}-${interval.key}`].loading).toBeTruthy();
    expect(newState.entities[`${podcastId}-${group}-${interval.key}`].loaded).toBeFalsy();
    expect(newState.entities[`${podcastId}-${group}-${interval.key}`].error).toBeNull();
  });

  it('should set podcast ranks entities and loaded on podcast ranks success', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastRanksSuccessAction({
        id: routerParams.podcastId, group: routerParams.group, interval: routerParams.interval,
        ranks: podcastAgentNameRanks, downloads: podcastAgentNameDownloads}));
    expect(newState.entities[`${routerParams.podcastId}-${routerParams.group}-${routerParams.interval.key}`]).toEqual({
      // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
      id: `${routerParams.podcastId}-${routerParams.group}-${routerParams.interval.key}`,
      key: `${routerParams.podcastId}-${routerParams.group}-${routerParams.interval.key}`,
      podcastId: routerParams.podcastId,
      group: routerParams.group,
      filter: undefined,
      interval: routerParams.interval,
      downloads: podcastAgentNameDownloads,
      ranks: podcastAgentNameRanks,
      loaded: true,
      loading: false
    });
  });

  it('should include filter in key for geo subdiv', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastRanksSuccessAction({
        id: routerParams.podcastId, group: GROUPTYPE_GEOSUBDIV, interval: routerParams.interval,
        ranks: podcastAgentNameRanks, downloads: podcastAgentNameDownloads}));
    expect(newState.entities[`${routerParams.podcastId}-${GROUPTYPE_GEOSUBDIV}-${routerParams.filter}-${routerParams.interval.key}`])
      .not.toBeNull();
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastRanksFailureAction({id: routerParams.podcastId, group: GROUPTYPE_AGENTNAME, interval: routerParams.interval,
        error: 'something went wrong'}));
    expect(newState.entities[`${routerParams.podcastId}-${routerParams.group}-${routerParams.interval.key}`].error).not.toBeUndefined();
  });
});
