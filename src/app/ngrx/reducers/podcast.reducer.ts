import { ActionTypes, ActionWithPayload, CmsPodcastsPayload } from '../actions';
import { PodcastModel } from '../model';

const initialState = [];

export function PodcastReducer(state: PodcastModel[] = initialState, action: ActionWithPayload<CmsPodcastsPayload>): PodcastModel[] {
  switch (action.type) {
    case ActionTypes.CMS_PODCASTS_SUCCESS:
      // console.log('PodcastReducer', action.type, action.payload.podcasts);
      return [...action.payload.podcasts];
    default:
      break;
  }
  return state;
}
