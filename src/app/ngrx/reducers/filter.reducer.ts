import { ActionTypes, ActionWithPayload, CastleFilterPayload } from '../actions';
import { FilterModel } from '../model';

const initialState = {};

export function FilterReducer(state: FilterModel = initialState, action: ActionWithPayload<CastleFilterPayload>): FilterModel {
  switch (action.type) {
    case ActionTypes.CASTLE_FILTER:
      const newState: FilterModel = {...state};
      if (action.payload.filter.podcast) {
        newState.podcast = action.payload.filter.podcast;
      }
      if (action.payload.filter.episodes) {
        newState.episodes = [...action.payload.filter.episodes];
      }
      if (action.payload.filter.beginDate || action.payload.filter.endDate) {
        // when can only be set with accompanying begin or end date
        // when can be set to undefined if begin or end date is present but when is not
        // (we can't generate dates in here, that would be non deterministic,
        // but we can and maybe should do it in action creators instead of components)
        newState.when = action.payload.filter.when;
      }
      // the reason that there is a range separate from the standard range "when"
      //  is because the when value becomes undefined when the begin and end dates do not
      //  match one of the valid options; however, the range sticks around so that prev/next
      //  buttons can still be used to page through based on the lat selected range
      if (action.payload.filter.range) {
        newState.range = action.payload.filter.range;
      }
      if (action.payload.filter.beginDate) {
        newState.beginDate = action.payload.filter.beginDate;
      }
      if (action.payload.filter.endDate) {
        newState.endDate = action.payload.filter.endDate;
      }
      if (action.payload.filter.interval) {
        newState.interval = action.payload.filter.interval;
      }
      // console.log('FilterReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}
