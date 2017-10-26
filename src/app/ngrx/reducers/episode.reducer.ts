import { ActionTypes, ActionWithPayload, CmsEpisodeGuidsPayload, CmsAllPodcastEpisodeGuidsAction  } from '../actions';
import { EpisodeModel } from '../model';

const initialState = [];

// TODO: should be able to use ActionWithPayload<All> here with the union type,
// but even though I upgraded TypeScript, it still can seem to get the typing right unless I also add an if instanceof =/
// https://github.com/ngrx/platform/blob/master/docs/store/actions.md#typed-actions
export function EpisodeReducer(state: EpisodeModel[] = initialState, action: ActionWithPayload<CmsEpisodeGuidsPayload>): EpisodeModel[] {
  let epIdx: number, newState: EpisodeModel[];
  switch (action.type) {
    case ActionTypes.CMS_ALL_PODCAST_EPISODE_GUIDS:
      const seriesId = action.payload.podcast.seriesId;
      epIdx = state.findIndex(e => e.seriesId === seriesId);
      if (epIdx > -1) {
        const existingEpisodes = state.filter(e => e.seriesId === seriesId);
        newState = [...state.slice(0, epIdx), ...action.payload.episodes, ...state.slice(epIdx + existingEpisodes.length)];
      } else {
        newState = [...action.payload.episodes, ...state];
      }
      sortEpisodesByReleaseDate(newState);
      // console.log('EpisodeReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}

const sortEpisodesByReleaseDate = (episodes: EpisodeModel[]) => {
  // sort the episodes by seriesId, publishedAt
  episodes.sort((a: EpisodeModel, b: EpisodeModel) => {
    if (a.seriesId !== b.seriesId) {
      return a.seriesId - b.seriesId;
    } else {
      return b.publishedAt.valueOf() - a.publishedAt.valueOf();
    }
  });
};
