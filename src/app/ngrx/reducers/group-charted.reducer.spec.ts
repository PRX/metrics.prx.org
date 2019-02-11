import { reducer, initialState, State, selectGroupChartedEntities } from './group-charted.reducer';
import * as ACTIONS from '../actions';
import { GROUPTYPE_AGENTNAME } from './models';

describe('Group Charted Reducer', () => {
  let newState: State;

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  function chartToggleGroup(state: State, charted: boolean) {
    return reducer(state,
      new ACTIONS.ChartToggleGroupAction({
        group: GROUPTYPE_AGENTNAME,
        groupName: 'Overcast',
        charted
      }));
  }

  it('should toggle chart on and off', () => {
    newState = chartToggleGroup(newState, false);
    expect(selectGroupChartedEntities(newState)[`${GROUPTYPE_AGENTNAME}-Overcast`].charted).toBeFalsy();
    newState = chartToggleGroup(newState, true);
    expect(selectGroupChartedEntities(newState)[`${GROUPTYPE_AGENTNAME}-Overcast`].charted).toBeTruthy();
  });
});
