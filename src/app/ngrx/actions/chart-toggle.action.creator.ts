import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { GroupType } from '../reducers/models';

export interface ChartSingleEpisodePayload {
  guid: string;
}

export class ChartSingleEpisodeAction implements Action {
  readonly type = ActionTypes.CHART_SINGLE_EPISODE;

  constructor(public payload: ChartSingleEpisodePayload) {}
}

export interface ChartToggleEpisodePayload {
  guid: string;
  charted: boolean;
}

export class ChartToggleEpisodeAction implements Action {
  readonly type = ActionTypes.CHART_TOGGLE_EPISODE;

  constructor(public payload: ChartToggleEpisodePayload) {}
}

export interface ChartTogglePodcastPayload {
  id: string;
  charted: boolean;
}

export class ChartTogglePodcastAction implements Action {
  readonly type = ActionTypes.CHART_TOGGLE_PODCAST;

  constructor(public payload: ChartTogglePodcastPayload) {}
}

export interface ChartToggleGroupPayload {
  group: GroupType;
  groupName: string;
  charted: boolean;
}

export class ChartToggleGroupAction implements Action {
  readonly type = ActionTypes.CHART_TOGGLE_GROUP;

  constructor(public payload: ChartToggleGroupPayload) {}
}
