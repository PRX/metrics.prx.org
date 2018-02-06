import * as ACTIONS from '../actions';

export interface EpisodeMetricsModel {
  seriesId: number;
  id: number;
  guid?: string;
  page?: number;
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

const episodeIndex = (state: EpisodeMetricsModel[], id: number, seriesId: number) => {
  return state.findIndex(e => e.seriesId === seriesId && e.id === id);
};

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD:
      if (action instanceof ACTIONS.CastleEpisodeMetricsLoadAction) {
        const { id, seriesId, guid, page } = action.payload;
        const epIdx = episodeIndex(state, id, seriesId);
        let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
        if (epIdx > -1) {
          episode = {...state[epIdx], id, seriesId, guid, page, loading: true, loaded: false};
          newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
        } else {
          episode = {seriesId, id, guid, page, loading: true, loaded: false};
          newState = [episode, ...state];
        }
        return newState;
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_SUCCESS:
      if (action instanceof ACTIONS.CastleEpisodeMetricsSuccessAction) {
        const { id, seriesId, guid, page, metricsPropertyName, metrics } = action.payload;
        const epIdx = episodeIndex(state, id, seriesId);
        let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
        if (epIdx > -1) {
          episode = {...state[epIdx], id, seriesId, guid, page, loading: false, loaded: true};
          episode[metricsPropertyName] = metrics;
          newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
        } else {
          episode = {seriesId, id, guid, page, loading: false, loaded: true};
          episode[metricsPropertyName] = metrics;
          newState = [episode, ...state];
        }
        return newState;
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_FAILURE:
      if (action instanceof ACTIONS.CastleEpisodeMetricsFailureAction) {
        const { id, seriesId, guid, page, error } = action.payload;
        const epIdx = episodeIndex(state, id, seriesId);
        let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
        if (epIdx > -1) {
          episode = {...state[epIdx], id, seriesId, guid, page, error, loading: false, loaded: false};
          newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
        } else {
          episode = {seriesId, id, guid, page, error, loading: false, loaded: false};
          newState = [episode, ...state];
        }
        return newState;
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_SUCCESS:
      if (action instanceof ACTIONS.CastleEpisodeAllTimeMetricsSuccessAction) {
        const { id, seriesId } = action.payload.episode;
        const epIdx = episodeIndex(state, id, seriesId);

        if (epIdx > -1) {
          let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
          episode = {id, seriesId, ...state[epIdx], allTimeDownloads: action.payload.allTimeDownloads};
          newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
          return newState;
        } else {
          return state;
        }
      }
      break;
    case ACTIONS.ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_FAILURE:
      if (action instanceof ACTIONS.CastleEpisodeAllTimeMetricsFailureAction) {
        const { error } = action.payload;
        if (action.payload['episode']) {
          const { id, seriesId } = action.payload['episode'];
          const epIdx = episodeIndex(state, id, seriesId);
          if (epIdx > -1) {
            let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
            episode = {id, seriesId, ...state[epIdx], error};
            newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
            return newState;
          }
        }
      }
      break;
    // TODO: TLDR; charted does not really belong here.
    // It belongs in the router state and should be combined with metrics state using a selector to get charted data
    // Not yet able to make the chart selector changes (release priority)
    // so am handling the ROUTER_NAVIGATION event here to catch changes to charted episodes via the route
    case ACTIONS.ActionTypes.CUSTOM_ROUTER_NAVIGATION: {
      const payload: ACTIONS.CustomRouterNavigationPayload = action['payload'];
      // update existing entries
      let newState: EpisodeMetricsModel[] = state.map(episodeMetrics => {
        if (!payload.routerState.episodeIds || payload.routerState.episodeIds.indexOf(episodeMetrics.id) === -1) {
          return {id: episodeMetrics.id, seriesId: episodeMetrics.seriesId, ...episodeMetrics, charted: false};
        } else {
          return {id: episodeMetrics.id, seriesId: episodeMetrics.seriesId, ...episodeMetrics, charted: true};
        }
      });
      // chart any entries on route but not yet on state
      if (payload.routerState.episodeIds) {
        const newIds = payload.routerState.episodeIds.filter(id => state.find(e => e.id === id) === undefined);
        newState = [
          ...newState,
          ...newIds.map(id => {
            return {id, seriesId: payload.routerState.podcastSeriesId, page: payload.routerState.page, charted: true};
          })
        ];
      }
      return newState;
    }
  }
  return state;
}
