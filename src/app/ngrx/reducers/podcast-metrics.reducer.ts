import * as ACTIONS from '../actions';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId?: string;
  charted?: boolean;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
  allTimeDownloads?: number;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}

const initialState = [];

const podcastIndex = (state: PodcastMetricsModel[], seriesId: number) => {
  return state.findIndex(p => p.seriesId === seriesId);
};

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_LOAD:
      if (action instanceof ACTIONS.CastlePodcastMetricsLoadAction) {
        const { seriesId, feederId} = action.payload;
        const podcastIdx = podcastIndex(state, seriesId);
        let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
        if (podcastIdx > -1) {
          podcast = {...state[podcastIdx], seriesId, loading: true, loaded: false};
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
        } else {
          podcast = {seriesId, feederId, loading: true, loaded: false};
          newState = [podcast, ...state];
        }
        return newState;
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_SUCCESS:
      if (action instanceof ACTIONS.CastlePodcastMetricsSuccessAction) {
        const { seriesId, feederId, metricsPropertyName, metrics } = action.payload;
        const podcastIdx = podcastIndex(state, seriesId);
        let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
        if (podcastIdx > -1) {
          podcast = {...state[podcastIdx], seriesId, loading: false, loaded: true};
          podcast[metricsPropertyName] = metrics;
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
        } else {
          podcast = {seriesId, feederId, loading: false, loaded: true};
          podcast[metricsPropertyName] = metrics;
          newState = [podcast, ...state];
        }
        return newState;
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_FAILURE:
      if (action instanceof ACTIONS.CastlePodcastMetricsFailureAction) {
        const { seriesId, feederId, error } = action.payload;
        const podcastIdx = podcastIndex(state, seriesId);
        let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
        if (podcastIdx > -1) {
          podcast = {...state[podcastIdx], seriesId, error, loading: false, loaded: false};
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
        } else {
          podcast = {seriesId, error, loading: false, loaded: false};
          newState = [podcast, ...state];
        }
        return newState;
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_SUCCESS:
      if (action instanceof ACTIONS.CastlePodcastAllTimeMetricsSuccessAction) {
        const { seriesId } = action.payload.podcast;
        const podcastIdx = podcastIndex(state, seriesId);

        if (podcastIdx > -1) {
          let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
          podcast = {seriesId, ...state[podcastIdx], allTimeDownloads: action.payload.allTimeDownloads};
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
          return newState;
        } else {
          return state;
        }
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_FAILURE:
      if (action instanceof ACTIONS.CastlePodcastAllTimeMetricsFailureAction) {
        const { error } = action.payload;
        if (action.payload['podcast']) {
          const { seriesId } = action.payload['podcast'];
          const podcastIdx = podcastIndex(state, seriesId);
          if (podcastIdx > -1) {
            let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
            podcast = {seriesId, ...state[podcastIdx], error};
            newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
            return newState;
          }
        }
      }
      break;
    // TODO: TLDR; charted does not really belong here.
    // It belongs in the router state and should be combined with metrics state using a selector to get charted data
    // Not yet able to make the chart selector changes (release priority)
    // so am handling the ROUTER_NAVIGATION event here to catch changes to whether the podcast is charted via the route
    case ACTIONS.ActionTypes.CUSTOM_ROUTER_NAVIGATION: {
      const payload: ACTIONS.CustomRouterNavigationPayload = action['payload'];
      const seriesId = payload.routerState.podcastSeriesId;
      const charted = payload.routerState.chartPodcast;
      const podcastIdx = podcastIndex(state, seriesId);
      let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
      if (podcastIdx > -1) {
        podcast = {seriesId, ...state[podcastIdx], charted};
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {seriesId, charted};
        newState = [podcast, ...state];
      }
      return newState;
    }
  }
  return state;
}
