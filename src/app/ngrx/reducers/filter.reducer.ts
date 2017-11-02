import { ActionTypes, ActionWithPayload, CastleFilterPayload, CastleFilterAction } from '../actions';
import { FilterModel } from '../model';

const initialState = {};

export function FilterReducer(state: FilterModel = initialState, action: ActionWithPayload<CastleFilterPayload>): FilterModel {
  switch (action.type) {
    case ActionTypes.CASTLE_FILTER:
      const newState: FilterModel = {...state};
      if (action.payload.filter.podcastSeriesId) {
        newState.podcastSeriesId = action.payload.filter.podcastSeriesId;
      }
      if (action.payload.filter.episodes) {
        newState.episodes = [...action.payload.filter.episodes];
      }
      if (action.payload.filter.beginDate || action.payload.filter.endDate) {
        // standardRange can only be set with accompanying begin or end date
        // standardRange can be set to undefined if begin or end date is present but standardRange is not
        newState.standardRange = action.payload.filter.standardRange;
      }
      // the reason that there is a range separate from the standardRange
      //  is because the standardRange value becomes undefined when the begin and end dates do not
      //  match one of the valid options; however, the range sticks around so that prev/next
      //  buttons can still be used to page through based on the last selected range and the date pickers
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
