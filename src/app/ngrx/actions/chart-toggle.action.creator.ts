import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { GroupType } from '../reducers/models';

export const ChartSingleEpisode = createAction(ActionTypes.CHART_SINGLE_EPISODE, props<{ podcastId: string; guid: string }>());

export const ChartToggleEpisode = createAction(
  ActionTypes.CHART_TOGGLE_EPISODE,
  props<{ podcastId: string; guid: string; charted: boolean }>()
);

export const ChartTogglePodcast = createAction(ActionTypes.CHART_TOGGLE_PODCAST, props<{ id: string; charted: boolean }>());

export const ChartToggleGroup = createAction(
  ActionTypes.CHART_TOGGLE_GROUP,
  props<{ group: GroupType; groupName: string; charted: boolean }>()
);
