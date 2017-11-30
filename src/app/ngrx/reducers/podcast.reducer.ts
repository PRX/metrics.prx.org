import { ActionTypes, CmsPodcastsAction } from '../actions';
import { PodcastModel } from '../model';

// initialState is undefined, not yet loaded; so when empty, no podcasts
export function PodcastReducer(state: PodcastModel[], action: CmsPodcastsAction): PodcastModel[] {
  switch (action.type) {
    case ActionTypes.CMS_PODCASTS:
      // console.log('PodcastReducer', action.type, action.payload.podcasts);
      return [...action.payload.podcasts];
    default:
      break;
  }
  return state;
}
