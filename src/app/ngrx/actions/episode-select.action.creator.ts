import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { MetricsType } from '../reducers/models';

export const EpisodeSelectEpisodes = createAction(
  ActionTypes.EPISODE_SELECT_EPISODES,
  props<{ podcastId: string; metricsType: MetricsType; episodeGuids: string[] }>()
);
