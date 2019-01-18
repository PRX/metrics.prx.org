import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';

export interface EpisodeSelectEpisodesPayload {
  episodeGuids: string[];
}

export class EpisodeSelectEpisodesAction implements Action {
  readonly type = ActionTypes.EPISODE_SELECT_EPISODES;

  constructor(public payload: EpisodeSelectEpisodesPayload) {}
}
