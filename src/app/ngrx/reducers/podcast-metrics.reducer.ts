import { Action } from '@ngrx/store';
import ActionTypes from '../actions/action.types';
import { PodcastMetricsModel } from '../../shared';
import { unsparseDataset, subtractDataset } from './metrics.util';

const initialState = [];

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: Action) {
  let podcastIdx: number, podcast: PodcastMetricsModel, newState: PodcastMetricsModel[], metricsProperty: string;
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS:
      metricsProperty = action.payload.filter.interval.key
        + action.payload.metricsType.charAt(0).toUpperCase()
        + action.payload.metricsType.slice(1);
      podcastIdx = state.findIndex(p => p.seriesId === action.payload.podcast.seriesId);
      if (podcastIdx > -1) {
        podcast = Object.assign({}, state[podcastIdx]);
        podcast[metricsProperty] = unsparseDataset(action.payload.filter, action.payload.metrics);
        podcast[metricsProperty + 'Others'] = [...podcast[metricsProperty]];
        podcast.episodeIdsNotInOthers = [];
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {
          seriesId: action.payload.podcast.seriesId,
          feederId: action.payload.podcast.feederId
        };
        podcast[metricsProperty] = unsparseDataset(action.payload.filter, action.payload.metrics);
        podcast[metricsProperty + 'Others'] = [...podcast[metricsProperty]];
        podcast.episodeIdsNotInOthers = [];
        newState = [podcast, ...state];
      }
      console.log('PodcastMetricsReducer', action.type, newState);
      return newState;
    case ActionTypes.CASTLE_EPISODE_METRICS:
      metricsProperty = action.payload.filter.interval.key
        + action.payload.metricsType.charAt(0).toUpperCase()
        + action.payload.metricsType.slice(1);
      podcastIdx = state.findIndex(p => p.seriesId === action.payload.episode.seriesId);
      if (podcastIdx > -1 &&
        action.payload.filter.episodes && // filter has episodes
        action.payload.filter.episodes.map(e => e.id).indexOf(action.payload.episode.id) !== -1 && // episode in filter
        state[podcastIdx].episodeIdsNotInOthers.indexOf(action.payload.episode.id) === -1 && // episode not already subtracted
        action.payload.metrics.length > 0) {// has metrics
        podcast = Object.assign({}, state[podcastIdx]);
        podcast[metricsProperty + 'Others'] = subtractDataset(podcast[metricsProperty + 'Others'],
          unsparseDataset(action.payload.filter, action.payload.metrics));
        if (podcast.episodeIdsNotInOthers) {
          podcast.episodeIdsNotInOthers.push(action.payload.episode.id);
        } else {
          podcast.episodeIdsNotInOthers = [action.payload.episode.id];
        }
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        newState = state; // no change
        // TODO: but then again, maybe this should revert back the total podcast dataset when episodes are not in filter
        // --> will deal with this when I get to episode selection
      }
      return newState;
    default:
      return state;
  }
}
