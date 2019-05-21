import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { MetricsType } from '../reducers/models';

export interface EpisodeSelectEpisodesPayload {
  podcastId: string;
  metricsType: MetricsType;
  episodeGuids: string[];
}

export class EpisodeSelectEpisodesAction implements Action {
  readonly type = ActionTypes.EPISODE_SELECT_EPISODES;

  constructor(public payload: EpisodeSelectEpisodesPayload) {}
}
