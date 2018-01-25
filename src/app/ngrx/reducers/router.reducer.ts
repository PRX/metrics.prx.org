import { ActionTypes, CustomRouterNavigationAction } from '../actions';
import { isPodcastChanged } from '../../shared/util/filter.util';
import { RouterModel } from './router.serializer';

const initialState = {};

// Reason for having our own Custom Router Reducer in addition to the Custom Router State Serializer:
// Things that are not in/relevant to the current URL, can still be saved in the application state
// so that for example, if you navigate away from Downloads, the chart type, interval, date range etc are not lost
// Still to be decided if the date range for downloads carries over to demographics or traffic sources
export function CustomRouterReducer(state: RouterModel = initialState, action: CustomRouterNavigationAction): RouterModel {
  switch (action.type) {
    case ActionTypes.CUSTOM_ROUTER_NAVIGATION:
      const newState: RouterModel = {...state};
      if (action.payload.routerState.podcastSeriesId) {
        newState.podcastSeriesId = action.payload.routerState.podcastSeriesId;
        if (isPodcastChanged(action.payload.routerState, state)) {
          newState.page = 1;
        }
      }
      if (action.payload.routerState.metricsType) {
        newState.metricsType = action.payload.routerState.metricsType;
      }
      if (action.payload.routerState.chartType) {
        newState.chartType = action.payload.routerState.chartType;
      }
      if (action.payload.routerState.interval) {
        newState.interval = action.payload.routerState.interval;
      }
      if (action.payload.routerState.page) {
        newState.page = action.payload.routerState.page;
      }
      if (action.payload.routerState.beginDate || action.payload.routerState.endDate) {
        // standardRange can only be set with accompanying begin or end date
        // standardRange can be set to undefined if begin or end date is present but standardRange is not
        newState.standardRange = action.payload.routerState.standardRange;
      }
      if (action.payload.routerState.beginDate) {
        newState.beginDate = action.payload.routerState.beginDate;
      }
      if (action.payload.routerState.endDate) {
        newState.endDate = action.payload.routerState.endDate;
      }
      if (action.payload.routerState.chartPodcast !== undefined) {
        newState.chartPodcast = action.payload.routerState.chartPodcast;
      }
      if (action.payload.routerState.episodeIds) {
        newState.episodeIds = [...action.payload.routerState.episodeIds];
      }
      return newState;
    default:
      return state;
  }
}

