import { reducer, initialState } from './episode-totals.reducer';
import * as ACTIONS from '../actions';
import {
  routerParams as downloadParams,
  episodes,
  ep0AgentNameRanks
} from '../../../testing/downloads.fixtures';
import { GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, episodeTotalsKey } from './models';

describe('Episode Totals Reducer', () => {
  const routerParams = {...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME};
  const guid = episodes[0].guid;

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should set loading, loaded, and unset error on episode totals load', () => {
    const { group, filter, beginDate, endDate } = routerParams;
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodeTotalsLoadAction({guid, group, beginDate, endDate}));
    const key = episodeTotalsKey(guid, group, filter, beginDate, endDate);
    expect(newState.entities[key].loading).toBeTruthy();
    expect(newState.entities[key].loaded).toBeFalsy();
    expect(newState.entities[key].error).toBeNull();
  });

  it('should set episode totals entities and loaded on episode totals success', () => {
    const { group, filter, beginDate, endDate } = routerParams;
    const key = episodeTotalsKey(guid, group, filter, beginDate, endDate);
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodeTotalsSuccessAction({
        guid, group, beginDate, endDate,
        ranks: ep0AgentNameRanks}));
    expect(newState.entities[key]).toEqual({
      // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
      id: key,
      key,
      guid,
      group,
      filter,
      beginDate,
      endDate,
      ranks: ep0AgentNameRanks,
      loaded: true,
      loading: false
    });
  });

  it('should include filter in key for geo subdiv', () => {
    const { group, filter, beginDate, endDate } = routerParams;
    const key = episodeTotalsKey(guid, group, filter, beginDate, endDate);
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodeTotalsSuccessAction({
        guid, group, filter, beginDate, endDate,
        ranks: ep0AgentNameRanks}));
    expect(newState.entities[key])
      .not.toBeNull();
  });

  it('should set error on failure', () => {
    const { group, filter, beginDate, endDate } = routerParams;
    const newState = reducer(initialState, new ACTIONS.CastleEpisodeTotalsFailureAction({
      guid, group, filter, beginDate, endDate, error: 'something went wrong'}));
    expect(newState.entities[episodeTotalsKey(guid, group, filter, beginDate, endDate)].error).not.toBeUndefined();
  });
});
