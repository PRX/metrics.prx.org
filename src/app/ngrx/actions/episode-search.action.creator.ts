import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';

export interface EpisodeSearchSelectEpisodesPayload {
  episodeGuids: string[];
}

export class EpisodeSearchSelectEpisodesAction implements Action {
  readonly type = ActionTypes.EPISODE_SEARCH_SELECT_EPISODES;

  constructor(public payload: EpisodeSearchSelectEpisodesPayload) {}
}

export interface EpisodeSearchPayload {
  search: string;
}
