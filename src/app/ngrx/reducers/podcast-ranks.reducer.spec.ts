import { reducer, initialState } from './podcast-ranks.reducer';
import * as ACTIONS from '../actions';
import { routerParams as downloadParams, podcastAgentNameRanks, podcastAgentNameDownloads } from '../../../testing/downloads.fixtures';
import { GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, podcastRanksId } from './models';

describe('Podcast Ranks Reducer', () => {
  const routerParams = { ...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should set loading, loaded, and unset error on podcast ranks load', () => {
    const { podcastId, group, filter, interval, beginDate, endDate } = routerParams;
    const newState = reducer(initialState, ACTIONS.CastlePodcastRanksLoad({ podcastId, group, interval, beginDate, endDate }));
    const id = podcastRanksId(podcastId, group, filter, interval, beginDate, endDate);
    expect(newState.entities[id].loading).toBeTruthy();
    expect(newState.entities[id].loaded).toBeFalsy();
    expect(newState.entities[id].error).toBeNull();
  });

  it('should set podcast ranks entities and loaded on podcast ranks success', () => {
    const { podcastId, group, filter, interval, beginDate, endDate } = routerParams;
    const id = podcastRanksId(podcastId, group, filter, interval, beginDate, endDate);
    const newState = reducer(
      initialState,
      ACTIONS.CastlePodcastRanksSuccess({
        podcastId,
        group,
        interval,
        beginDate,
        endDate,
        ranks: podcastAgentNameRanks,
        downloads: podcastAgentNameDownloads
      })
    );
    expect(newState.entities[id]).toEqual({
      id,
      podcastId,
      group,
      filter,
      interval,
      beginDate,
      endDate,
      downloads: podcastAgentNameDownloads,
      ranks: podcastAgentNameRanks,
      loaded: true,
      loading: false
    });
  });

  it('should include filter in key for geo subdiv', () => {
    const { podcastId, group, filter, interval, beginDate, endDate } = routerParams;
    const newState = reducer(
      initialState,
      ACTIONS.CastlePodcastRanksSuccess({
        podcastId,
        group,
        interval,
        beginDate,
        endDate,
        ranks: podcastAgentNameRanks,
        downloads: podcastAgentNameDownloads
      })
    );
    expect(newState.entities[podcastRanksId(podcastId, group, filter, interval, beginDate, endDate)]).not.toBeNull();
  });

  it('should set error on failure', () => {
    const { podcastId, group, filter, interval, beginDate, endDate } = routerParams;
    const newState = reducer(
      initialState,
      ACTIONS.CastlePodcastRanksFailure({
        podcastId,
        group,
        interval,
        beginDate,
        endDate,
        error: 'something went wrong'
      })
    );
    expect(newState.entities[podcastRanksId(podcastId, group, filter, interval, beginDate, endDate)].error).not.toBeUndefined();
  });
});
