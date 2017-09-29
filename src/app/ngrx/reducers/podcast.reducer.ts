import { ActionTypes, ActionWithPayload, CmsPodcastFeedPayload } from '../actions';
import { PodcastModel } from '../model';

const initialState = [];

export function PodcastReducer(state: PodcastModel[] = initialState, action: ActionWithPayload<CmsPodcastFeedPayload>): PodcastModel[] {
  let podcastIdx: number, podcast: PodcastModel, newState: PodcastModel[];
  switch (action.type) {
    case ActionTypes.CMS_PODCAST_FEED:
      podcastIdx = state.findIndex(p => p.seriesId === action.payload.podcast.seriesId);
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx],
          doc: action.payload.podcast.doc,
          seriesId: action.payload.podcast.seriesId,
          title: action.payload.podcast.title,
          feederUrl: action.payload.podcast.feederUrl,
          feederId: action.payload.podcast.feederId
        };
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        newState = [...state, action.payload.podcast];
      }
      // console.log('PodcastReducer', action.type, newState);
      return newState;
    default:
      break;
  }
  return state;
}
