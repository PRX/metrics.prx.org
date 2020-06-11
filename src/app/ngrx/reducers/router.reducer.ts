import { ActionTypes, CustomRouterNavigationAction } from '../actions';
import { RouterParamsState } from './models';

const initialState = { url: null, routerParams: {} };

// Reason for having our own Custom Router Reducer in addition to the Custom Router State Serializer:
// Things that are not in/relevant to the current URL, can still be saved in the application state
// so that for example, if you navigate away from Downloads, the chart type, interval, date range etc are not lost
// Still to be decided if the date range for downloads carries over to demographics or traffic sources
export function CustomRouterReducer(state: RouterParamsState = initialState, action: CustomRouterNavigationAction): RouterParamsState {
  switch (action.type) {
    case ActionTypes.CUSTOM_ROUTER_NAVIGATION: {
      const { url, routerParams } = action.payload;
      const {
        podcastId,
        metricsType,
        group,
        filter,
        chartType,
        interval,
        episodePage,
        standardRange,
        beginDate,
        endDate,
        days
      } = routerParams;
      return {
        url: url || state.url,
        routerParams: {
          ...state.routerParams,
          ...(podcastId && { podcastId }),
          ...(metricsType && { metricsType }),
          ...(group && { group }),
          // filter can be explicitly set to undefined
          ...(action.payload.routerParams.hasOwnProperty('filter') && { filter }),
          ...(chartType && { chartType }),
          ...(interval && { interval }),
          ...(episodePage && { episodePage }),
          // standardRange can only be set with accompanying begin or end date
          // standardRange can be set to undefined if begin or end date is present but standardRange is not
          ...((action.payload.routerParams.beginDate || action.payload.routerParams.endDate) && { standardRange }),
          ...(beginDate && { beginDate }),
          ...(endDate && { endDate }),
          ...(days && { days })
        }
      };
    }
    default:
      return state;
  }
}
