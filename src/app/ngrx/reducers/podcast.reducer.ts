import { Action } from '@ngrx/store';
import ActionTypes from '../actions/action.types';
import { PodcastModel } from '../model';

const initialState = [];

export function PodcastReducer(state: PodcastModel[] = initialState, action: Action) {
  let podcastIdx: number, epIdx: number, podcast: PodcastModel, newState: PodcastModel[];
  switch (action.type) {
    case ActionTypes.CMS_PODCAST_FEED:
      podcastIdx = state.findIndex(p => p.seriesId === action.payload.podcast.seriesId);
      if (podcastIdx > -1) {
        podcast = Object.assign({}, state[podcastIdx], {
          doc: action.payload.podcast.doc,
          seriesId: action.payload.podcast.seriesId,
          title: action.payload.podcast.title,
          feederUrl: action.payload.podcast.feederUrl,
          feederId: action.payload.podcast.feederId
        });
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        newState = [action.payload.podcast, ...state];
      }
      console.log('PodcastReducer', action.type, newState);
      return newState;
    case ActionTypes.CMS_EPISODE_GUID:
      podcastIdx = state.findIndex(p => p.seriesId === action.payload.podcast.seriesId);
      if (podcastIdx > -1) {
        podcast = Object.assign({}, state[podcastIdx]);

        if (!podcast.episodeIds) {
          podcast.episodeIds = [action.payload.episode.id];
        } else if (podcast.episodeIds.indexOf(action.payload.episode.id) === -1) {
          podcast.episodeIds.push(action.payload.episode.id);
        }

        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        newState = [{
          doc: action.payload.podcast.doc,
          seriesId: action.payload.podcast.seriesId,
          title: action.payload.podcast.title,
          feederUrl: action.payload.podcast.feederUrl,
          feederId: action.payload.podcast.feederId,
          episodeIds: [action.payload.episode.id]
        }, ...state];
      }
      console.log('PodcastReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}
