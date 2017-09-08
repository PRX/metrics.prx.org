import { Action } from '@ngrx/store';
import ActionTypes from '../actions/action.types';
import { FilterModel } from '../../shared';

const initialState = {};

export function FilterReducer(state: FilterModel = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.CASTLE_FILTER:
      const newState: FilterModel = Object.assign({}, state);
      if (action.payload.filter.podcast) {
        newState.podcast = action.payload.filter.podcast;
      }
      if (action.payload.filter.episodes) {
        newState.episodes = action.payload.filter.episodes;
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
      return newState;
    default:
      return state;
  }
}
