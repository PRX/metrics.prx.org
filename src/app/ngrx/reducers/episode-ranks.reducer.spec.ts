import { reducer, initialState } from './episode-ranks.reducer';
import * as ACTIONS from '../actions';
import { routerParams as downloadParams, episodes, ep0AgentNameRanks, ep0AgentNameDownloads } from '../../../testing/downloads.fixtures';
import { GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, episodeRanksId } from './models';

describe('Episode Ranks Reducer', () => {
  const routerParams = { ...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should set loading, loaded, and unset error on episode ranks load', () => {
    const { group, filter, interval, beginDate, endDate } = routerParams;
    const newState = reducer(initialState, ACTIONS.CastleEpisodeRanksLoad({ guid: episodes[0].guid, group, interval, beginDate, endDate }));
    const id = episodeRanksId(episodes[0].guid, group, filter, interval, beginDate, endDate);
    expect(newState.entities[id].loading).toBeTruthy();
    expect(newState.entities[id].loaded).toBeFalsy();
    expect(newState.entities[id].error).toBeNull();
  });

  it('should set episode ranks entities and loaded on episode ranks success', () => {
    const { group, filter, interval, beginDate, endDate } = routerParams;
    const id = episodeRanksId(episodes[0].guid, group, filter, interval, beginDate, endDate);
    const newState = reducer(
      initialState,
      ACTIONS.CastleEpisodeRanksSuccess({
        guid: episodes[0].guid,
        group,
        interval,
        beginDate,
        endDate,
        ranks: ep0AgentNameRanks,
        downloads: ep0AgentNameDownloads
      })
    );
    expect(newState.entities[id]).toEqual({
      id,
      guid: episodes[0].guid,
      group,
      filter,
      interval,
      beginDate,
      endDate,
      downloads: ep0AgentNameDownloads,
      ranks: ep0AgentNameRanks,
      loaded: true,
      loading: false
    });
  });

  it('should include filter in key for geo subdiv', () => {
    const { group, filter, interval, beginDate, endDate } = routerParams;
    const newState = reducer(
      initialState,
      ACTIONS.CastleEpisodeRanksSuccess({
        guid: episodes[0].guid,
        group,
        interval,
        beginDate,
        endDate,
        ranks: ep0AgentNameRanks,
        downloads: ep0AgentNameDownloads
      })
    );
    expect(newState.entities[episodeRanksId(episodes[0].guid, group, filter, interval, beginDate, endDate)]).not.toBeNull();
  });

  it('should set error on failure', () => {
    const { group, filter, interval, beginDate, endDate } = routerParams;
    const newState = reducer(
      initialState,
      ACTIONS.CastleEpisodeRanksFailure({
        guid: episodes[0].guid,
        group,
        interval,
        beginDate,
        endDate,
        error: 'something went wrong'
      })
    );
    expect(newState.entities[episodeRanksId(episodes[0].guid, group, filter, interval, beginDate, endDate)].error).not.toBeUndefined();
  });
});
