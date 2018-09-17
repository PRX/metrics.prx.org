import { ActionTypes, CustomRouterNavigationAction } from '../actions';
import { RouterParams } from './models';

const initialState = {};

// Reason for having our own Custom Router Reducer in addition to the Custom Router State Serializer:
// Things that are not in/relevant to the current URL, can still be saved in the application state
// so that for example, if you navigate away from Downloads, the chart type, interval, date range etc are not lost
// Still to be decided if the date range for downloads carries over to demographics or traffic sources
export function CustomRouterReducer(state: RouterParams = initialState, action: CustomRouterNavigationAction): RouterParams {
  switch (action.type) {
    case ActionTypes.CUSTOM_ROUTER_NAVIGATION:
      const newState: RouterParams = {...state};
      if (action.payload.routerParams.podcastId) {
        newState.podcastId = action.payload.routerParams.podcastId;
      }
      if (action.payload.routerParams.metricsType) {
        newState.metricsType = action.payload.routerParams.metricsType;
      }
      if (action.payload.routerParams.group) {
        newState.group = action.payload.routerParams.group;
      }
      // filter can be explicitly set to undefined
      if (action.payload.routerParams.hasOwnProperty('filter')) {
        newState.filter = action.payload.routerParams.filter;
      }
      if (action.payload.routerParams.chartType) {
        newState.chartType = action.payload.routerParams.chartType;
      }
      if (action.payload.routerParams.interval) {
        newState.interval = action.payload.routerParams.interval;
      }
      if (action.payload.routerParams.episodePage) {
        newState.episodePage = action.payload.routerParams.episodePage;
      }
      if (action.payload.routerParams.beginDate || action.payload.routerParams.endDate) {
        // standardRange can only be set with accompanying begin or end date
        // standardRange can be set to undefined if begin or end date is present but standardRange is not
        newState.standardRange = action.payload.routerParams.standardRange;
      }
      if (action.payload.routerParams.beginDate) {
        newState.beginDate = action.payload.routerParams.beginDate;
      }
      if (action.payload.routerParams.endDate) {
        newState.endDate = action.payload.routerParams.endDate;
      }
      return newState;
    default:
      return state;
  }
}

