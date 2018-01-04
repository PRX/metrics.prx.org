import { ActionTypes, CastleFilterAction } from '../actions';
import { FilterModel } from '../';
import { isPodcastChanged } from '../../shared/util/filter.util';

export interface IntervalModel {
  value: string;
  name: string;
  key: string;
}

export const INTERVAL_MONTHLY: IntervalModel = { value: '1M', name: 'Monthly', key: 'monthly' };
export const INTERVAL_WEEKLY: IntervalModel = { value: '1w', name: 'Weekly', key: 'weekly' };
export const INTERVAL_DAILY: IntervalModel = { value: '1d', name: 'Daily', key: 'daily' };
export const INTERVAL_HOURLY: IntervalModel = { value: '1h', name: 'Hourly', key: 'hourly' };
export const IntervalList = [INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY];

export interface FilterModel {
  podcastSeriesId?: number;
  page?: number;
  standardRange?: string;
  beginDate?: Date;
  endDate?: Date;
  interval?: IntervalModel;
}

const initialState = {};

export function FilterReducer(state: FilterModel = initialState, action: CastleFilterAction): FilterModel {
  switch (action.type) {
    case ActionTypes.CASTLE_FILTER:
      const newState: FilterModel = {...state};
      if (action.payload.filter.podcastSeriesId) {
        newState.podcastSeriesId = action.payload.filter.podcastSeriesId;
        if (isPodcastChanged(action.payload.filter, state)) {
          newState.page = 1;
        }
      }
      if (action.payload.filter.page) {
        newState.page = action.payload.filter.page;
      }
      if (action.payload.filter.beginDate || action.payload.filter.endDate) {
        // standardRange can only be set with accompanying begin or end date
        // standardRange can be set to undefined if begin or end date is present but standardRange is not
        newState.standardRange = action.payload.filter.standardRange;
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

