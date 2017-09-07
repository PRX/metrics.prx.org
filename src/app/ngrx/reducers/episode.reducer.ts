import { Action } from '@ngrx/store';
import ActionTypes from '../actions/action.types';
import { EpisodeModel } from '../../shared';

const initialState = [];

export function EpisodeReducer(state: EpisodeModel[] = initialState, action: Action) {
  let epIdx: number, episode: EpisodeModel, newState: EpisodeModel[];
  switch (action.type) {
    case ActionTypes.CMS_EPISODE_GUID:
      const { doc, id, title, publishedAt, feederUrl, guid } = action.payload.episode;
      epIdx = state.findIndex(e => e.seriesId === action.payload.podcast.seriesId && e.guid === action.payload.episode.guid);
      if (epIdx > -1) {
        episode = Object.assign({}, state[epIdx], {seriesId: action.payload.series.id}, {doc, id, title, publishedAt, feederUrl, guid});
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = Object.assign({}, action.payload.episode);
        episode.seriesId = action.payload.podcast.seriesId;
        newState = [episode, ...state];
      }

      // sort the episodes by seriesId, publishedAt
      newState.sort((a: EpisodeModel, b: EpisodeModel) => {
        if (a.seriesId !== b.seriesId) {
          return a.seriesId - b.seriesId;
        } else {
          return b.publishedAt.valueOf() - a.publishedAt.valueOf();
        }
      });

      console.log('EpisodeReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}
