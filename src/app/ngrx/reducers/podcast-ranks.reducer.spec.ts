import { reducer, initialState } from './podcast-ranks.reducer';
import * as ACTIONS from '../actions';
import {
  routerParams as downloadParams,
  podcastAgentNameRanks,
  podcastAgentNameDownloads
} from '../../../testing/downloads.fixtures';
import { GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES } from './models';

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
    const { group, interval, beginDate, endDate } = routerParams;
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastRanksLoadAction({id: routerParams.podcastId, group, interval, beginDate, endDate}));
    expect(newState.loading).toBeTruthy();
    expect(newState.loaded).toBeFalsy();
    expect(newState.error).toBeNull();
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
      interval: routerParams.interval,
      downloads: podcastAgentNameDownloads,
      ranks: podcastAgentNameRanks
    });
    expect(newState.loaded).toBeTruthy();
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastRanksFailureAction({id: routerParams.podcastId, group: GROUPTYPE_AGENTNAME, error: 'something went wrong'}));
    expect(newState.error).not.toBeUndefined();
  });
});
