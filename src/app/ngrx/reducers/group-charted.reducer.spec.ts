import { reducer, initialState, State, selectAllGroupCharted, selectGroupChartedEntities } from './group-charted.reducer';
import * as ACTIONS from '../actions';
import { GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES } from './models';
import {
  routerParams as downloadParams,
  podcastAgentNameRanks,
  podcastAgentNameDownloads,
  episodes,
  ep0AgentNameRanks,
  ep0AgentNameDownloads
} from '../../../testing/downloads.fixtures';

describe('Group Charted Reducer', () => {
  const routerParams = {...downloadParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME};
  const { podcastId, group, interval, beginDate, endDate } = routerParams;
  let newState: State;

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  function episodeRanksSuccess(state: State) {
    return reducer(state,
      new ACTIONS.CastleEpisodeRanksSuccessAction({
        guid: episodes[0].guid, group, interval, beginDate, endDate,
        ranks: ep0AgentNameRanks, downloads: ep0AgentNameDownloads}));
  }

  function podcastRanksSuccess(state: State) {
    return reducer(state,
      new ACTIONS.CastlePodcastRanksSuccessAction({
        id: podcastId, group, interval, beginDate, endDate,
        ranks: podcastAgentNameRanks, downloads: podcastAgentNameDownloads}));
  }

  function chartToggleGroup(state: State, charted: boolean) {
    return reducer(state,
      new ACTIONS.ChartToggleGroupAction({
        group: GROUPTYPE_AGENTNAME,
        groupName: 'Overcast',
        charted
      }));
  }

  describe('initialization', () => {
    beforeEach(() => {
      newState = podcastRanksSuccess(initialState);
      newState = episodeRanksSuccess(newState);
    });

    it ('should initialize all groups as charted on load', () => {
      const groups = podcastAgentNameRanks.concat(ep0AgentNameRanks).map(v => v.label).filter((v, i, a) => a.indexOf(v) === i);
      expect(selectAllGroupCharted(newState).every(g => g.charted)).toBeTruthy();
      expect(selectAllGroupCharted(newState).length).toEqual(groups.length);
    });

    it ('if group was toggled off, will not reset on load', () => {
      newState = chartToggleGroup(newState, false);
      newState = episodeRanksSuccess(newState);
      expect(selectGroupChartedEntities(newState)[`${GROUPTYPE_AGENTNAME}-Overcast`].charted).toBeFalsy();
    });
  });

  it('should toggle chart on and off', () => {
    newState = chartToggleGroup(newState, false);
    expect(selectGroupChartedEntities(newState)[`${GROUPTYPE_AGENTNAME}-Overcast`].charted).toBeFalsy();
    newState = chartToggleGroup(newState, true);
    expect(selectGroupChartedEntities(newState)[`${GROUPTYPE_AGENTNAME}-Overcast`].charted).toBeTruthy();
  });
});
